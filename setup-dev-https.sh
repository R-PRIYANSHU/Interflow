#!/bin/bash

# Script to set up local HTTPS development environment using mkcert,
# with optional support for network IP address access.

echo "--- Setting up Local HTTPS for Development ---"
echo "ℹ️ Note: On Linux systems like Ubuntu, you might need to run this script with 'sudo' if it fails, especially during CA installation."

# --- Check for Dependencies ---
command -v mkcert >/dev/null 2>&1 || {
    echo >&2 "❌ Error: mkcert is not installed. Please install it."
    echo >&2 "   macOS:         'brew install mkcert'"
    echo >&2 "   Debian/Ubuntu: 'sudo apt update && sudo apt install libnss3-tools mkcert'" # Added specific Ubuntu instruction
    echo >&2 "   Arch:          'sudo pacman -S mkcert'"
    echo >&2 "   See https://github.com/FiloSottile/mkcert#installation for details. Aborting."
    exit 1
}
command -v jq >/dev/null 2>&1 || {
    echo >&2 "❌ Error: jq is not installed. Please install it."
    echo >&2 "   macOS:         'brew install jq'"
    echo >&2 "   Debian/Ubuntu: 'sudo apt update && sudo apt install jq'" # Added specific Ubuntu instruction
    echo >&2 "   Arch:          'sudo pacman -S jq'"
    echo >&2 "   Aborting."
    exit 1
}
command -v awk >/dev/null 2>&1 || { echo >&2 "❌ Error: awk is not installed (this is highly unusual). Please install it. Aborting."; exit 1; }
# The 'ip' command is usually in 'iproute2' package, standard on modern Linux including Ubuntu
command -v ip >/dev/null 2>&1 || { echo >&2 "⚠️ Warning: 'ip' command not found. Automatic IP detection for Linux might fail (Install 'iproute2' package)."; }
command -v ls >/dev/null 2>&1 || { echo >&2 "❌ Error: 'ls' command not found (this is extremely unusual). Aborting."; exit 1; }
command -v head >/dev/null 2>&1 || { echo >&2 "❌ Error: 'head' command not found (this is extremely unusual). Aborting."; exit 1; }
command -v grep >/dev/null 2>&1 || { echo >&2 "❌ Error: 'grep' command not found (this is extremely unusual). Aborting."; exit 1; }


echo "✅ Dependencies checked."

# --- Install Local CA ---
echo "🚀 Installing local Certificate Authority (CA)..."
# Use mkcert -install directly. If it fails, the error message guides the user.
mkcert -install
if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to install local CA with mkcert."
    echo "   This often requires root privileges on Linux (like Ubuntu)."
    echo "   Please try running this script again using 'sudo $0'." # Suggest using sudo
    exit 1
fi
echo "✅ Local CA installed successfully."

# --- Determine Certificate Names (localhost vs IP) ---
TARGET_NAMES="localhost 127.0.0.1 ::1"
DETECTED_IP=""
INCLUDE_IP=false

read -p "❓ Generate certificate for network access (includes local IP)? (y/N): " -n 1 -r
echo # Move to a new line

if [[ $REPLY =~ ^[Yy]$ ]]; then
    INCLUDE_IP=true
    echo "🔎 Attempting to detect local IP address..."
    # Try macOS detection first
    if command -v ipconfig &> /dev/null && [[ "$OSTYPE" == "darwin"* ]]; then
        DETECTED_IP=$(ipconfig getifaddr en0 || ipconfig getifaddr en1 || echo "")
    # Try Linux detection (should work on Ubuntu)
    elif command -v ip &> /dev/null && [[ "$OSTYPE" == "linux-gnu"* ]]; then
         # Get primary non-localhost IPv4 address using the 'ip' command
        DETECTED_IP=$(ip -4 addr show scope global | grep -oP 'inet \K[\d.]+' | head -n 1 || echo "")
    fi

    if [ -n "$DETECTED_IP" ]; then
        echo "✅ Detected IP: $DETECTED_IP"
        TARGET_NAMES="$DETECTED_IP localhost 127.0.0.1 ::1"
    else
        echo "⚠️ Could not automatically detect IP address."
        # Prompt if IP detection failed or 'ip' command was missing
        read -p "➡️ Please enter your primary local network IP address: " USER_IP
        if [[ "$USER_IP" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
            TARGET_NAMES="$USER_IP localhost 127.0.0.1 ::1"
            DETECTED_IP=$USER_IP # Store user-provided IP for final instructions
            echo "✅ Using IP: $USER_IP"
        else
            echo "❌ Invalid IP address entered. Falling back to localhost only."
            TARGET_NAMES="localhost 127.0.0.1 ::1"
            INCLUDE_IP=false # Revert flag if IP is invalid
        fi
    fi
else
    echo "ℹ️ Generating certificate for localhost only."
fi


# --- Generate Certificates ---
echo "🚀 Generating certificates for: $TARGET_NAMES ..."
# Use eval to handle spaces in TARGET_NAMES correctly when passing to mkcert
eval mkcert $TARGET_NAMES
MKCERT_EXIT_CODE=$?

if [ $MKCERT_EXIT_CODE -ne 0 ]; then
    echo "❌ Error: Failed to generate certificates with mkcert (Exit code: $MKCERT_EXIT_CODE)."
    exit 1
fi

# --- Find Newest Cert/Key Files using ls -t ---
echo "🔎 Identifying generated certificate files..."
# Use ls -t to list files by modification time (newest first) and head -n 1 to get the first one.
# Filter specifically for .pem BUT EXCLUDE -key.pem for the cert file.
CERT_FILE=$(ls -t *.pem 2>/dev/null | grep -v -- '-key\.pem$' | head -n 1)
# Filter specifically for -key.pem for the key file.
KEY_FILE=$(ls -t *-key.pem 2>/dev/null | head -n 1)


# Validate filenames found by ls
if [ -z "$CERT_FILE" ] || [ -z "$KEY_FILE" ]; then
    echo "❌ Error: Could not find recently generated .pem or -key.pem files using 'ls -t'."
    echo "   Make sure mkcert ran successfully in the current directory."
    echo "   Please check the directory for certificate files manually."
    exit 1
fi

# Check if the found files actually exist (redundant but safe)
if [ ! -f "$CERT_FILE" ] || [ ! -f "$KEY_FILE" ]; then
    echo "❌ Error: Identified certificate files ('$CERT_FILE', '$KEY_FILE') do not exist or are not readable."
    echo "   There might be an issue with file listing, creation, or permissions."
    exit 1
fi

echo "✅ Certificates identified: Cert='$CERT_FILE', Key='$KEY_FILE'"


# --- Update package.json ---
PACKAGE_JSON="package.json"
TEMP_PACKAGE_JSON="package.json.tmp"

if [ ! -f "$PACKAGE_JSON" ]; then
    echo "❌ Error: package.json not found in the current directory."
    echo "   Please run this script from your project's root directory."
    exit 1
fi

echo "🚀 Updating 'scripts.dev' in $PACKAGE_JSON using '$KEY_FILE' and '$CERT_FILE'..."

# Use jq to update the dev script with the identified filenames
# Ensure jq can write the temp file (permissions)
jq --arg cert "$CERT_FILE" --arg key "$KEY_FILE" \
   '.scripts.dev = "next dev --turbopack --experimental-https --experimental-https-key \($key) --experimental-https-cert \($cert)"' \
   "$PACKAGE_JSON" > "$TEMP_PACKAGE_JSON" 2>/dev/null # Redirect jq errors

# Check jq exit status and if the temp file was created and has content
if [ $? -ne 0 ] || [ ! -s "$TEMP_PACKAGE_JSON" ]; then
    echo "❌ Error: Failed to update $PACKAGE_JSON using jq."
    echo "   - Check if '$PACKAGE_JSON' is valid JSON."
    echo "   - Check if you have write permissions in the current directory."
    # Show jq error if possible
    jq --arg cert "$CERT_FILE" --arg key "$KEY_FILE" \
       '.scripts.dev = "next dev --turbopack --experimental-https --experimental-https-key \($key) --experimental-https-cert \($cert)"' \
       "$PACKAGE_JSON" > /dev/null
    rm -f "$TEMP_PACKAGE_JSON" # Clean up temp file if it exists but is empty/invalid
    exit 1
fi

# Replace original with updated file
# Use 'mv' which usually preserves ownership/permissions better than redirection
mv "$TEMP_PACKAGE_JSON" "$PACKAGE_JSON"
if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to replace $PACKAGE_JSON with the updated version."
    echo "   Check directory permissions."
    exit 1
fi


echo "✅ $PACKAGE_JSON updated successfully."

# --- Final Instructions ---
echo ""
echo "--- 🎉 Setup Complete! ---"
echo "You can now run the development server with HTTPS:"
echo "  npm run dev"
echo ""
echo "Access the application via:"
echo "  https://localhost:3000"
if $INCLUDE_IP; then
    IP_TO_USE=${DETECTED_IP:-$USER_IP} # Use detected or manually entered IP
    if [ -n "$IP_TO_USE" ]; then
        echo "  https://"$IP_TO_USE":3000 (from other devices on your network)"
        echo ""
        echo "🚨 IMPORTANT FOR NETWORK ACCESS:"
        echo "   You MUST install the mkcert root CA certificate on any other devices"
        echo "   you want to test from. Find the CA path with 'mkcert -CAROOT',"
        echo "   transfer the 'rootCA.pem' file from that directory to the other device,"
        echo "   and follow device-specific instructions to install it as a trusted root CA."
    fi
fi
echo ""
echo "ℹ️ Note: Your browser might show a security warning initially for the self-signed certificate."
echo "   This is expected. You should accept the risk or add an exception for development."
echo "-----------------------------------------"

exit 0