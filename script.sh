#!/bin/bash

# =====================================================
# ✨ Local HTTPS Development Environment Setup ✨
# =====================================================
# This script uses mkcert to generate locally-trusted
# development certificates for HTTPS, optionally including
# your local network IP address.
# =====================================================

echo ""
echo "👋 Welcome! Let's get your local HTTPS environment set up."
echo "ℹ️ Note: On Linux systems (like Ubuntu), you might need 'sudo'"
echo "   if the script encounters permission issues, especially when"
echo "   installing the local Certificate Authority (CA)."
echo ""

# --- 🛠️ 1. Checking Prerequisites ---
echo "--- 🛠️ 1. Checking Prerequisites ---"
echo "Verifying required tools (mkcert, jq, git, etc.)..."

# Function to check command and exit if not found
check_command() {
    command -v "$1" >/dev/null 2>&1 || {
        echo >&2 "❌ Error: Required command '$1' is not installed."
        # Provide specific install instructions if known
        case "$1" in
            mkcert)
                echo >&2 "   Please install mkcert:"
                echo >&2 "   ➡️ macOS:         'brew install mkcert'"
                echo >&2 "   ➡️ Debian/Ubuntu: 'sudo apt update && sudo apt install libnss3-tools mkcert'"
                echo >&2 "   ➡️ Arch Linux:    'sudo pacman -S mkcert'"
                echo >&2 "   ➡️ Other:         See https://github.com/FiloSottile/mkcert#installation"
                ;;
            jq)
                echo >&2 "   Please install jq:"
                echo >&2 "   ➡️ macOS:         'brew install jq'"
                echo >&2 "   ➡️ Debian/Ubuntu: 'sudo apt update && sudo apt install jq'"
                echo >&2 "   ➡️ Arch Linux:    'sudo pacman -S jq'"
                ;;
            git)
                echo >&2 "   Please install git using your system's package manager."
                ;;
            npm)
                echo >&2 "   Please install Node.js and npm (Node Package Manager)."
                echo >&2 "   ➡️ See: https://nodejs.org/"
                ;;
            awk|ls|head|grep)
                 echo >&2 "   This is a standard system utility. Its absence is unexpected."
                 echo >&2 "   Please ensure your system's core utilities are installed correctly."
                 ;;
            ip)
                 echo >&2 "   'ip' command (usually from 'iproute2' package on Linux) not found."
                 echo >&2 "   ⚠️ Automatic IP detection for Linux might fail. Consider installing 'iproute2'."
                 # Don't exit for 'ip', just warn, as we have fallbacks
                 return # Return instead of exit
                 ;;
        esac
        echo >&2 "Aborting setup. 🛑"
        exit 1
    }
    echo "   ✅ Found '$1'"
}

check_command mkcert
check_command jq
check_command awk
check_command ls
check_command head
check_command grep
check_command git
check_command npm
check_command ip # Checks 'ip' but doesn't exit if missing, only warns

echo "🚀 Attempting to update the script itself via git..."
# Assuming the script is in a git repo and should be updated
git pull
if [ $? -ne 0 ]; then
    echo "⚠️ Warning: 'git pull' failed. Continuing with the current script version."
    echo "   (This is okay if the script isn't managed by git or you're offline)."
else
    echo "   ✅ Script potentially updated."
fi

echo "✅ All necessary tools seem to be present!"
echo ""

# --- 🛡️ 2. Installing Local Certificate Authority (CA) ---
echo "--- 🛡️ 2. Installing Local Certificate Authority (CA) ---"
echo "Asking mkcert to install its local CA into your trust stores."
echo "This might require your administrator password (for sudo)."

# Use mkcert -install directly. If it fails, the error message guides the user.
mkcert -install
if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to install the mkcert local CA."
    echo "   This step often requires administrator privileges."
    echo "   👉 On Linux (like Ubuntu), please try running this script again using: 'sudo $0'"
    echo "Aborting setup. 🛑"
    exit 1
fi
echo "✅ Successfully installed the mkcert local CA. Your system now trusts certificates created by mkcert."
echo ""

# --- 🏷️ 3. Determining Certificate Domains ---
echo "--- 🏷️ 3. Determining Certificate Domains ---"
TARGET_NAMES="localhost 127.0.0.1 ::1" # Default targets
DETECTED_IP=""
INCLUDE_IP=false

echo "By default, the certificate works for 'localhost'."
read -p "❓ Do you also want to access your dev server using your network IP address (e.g., from other devices)? (y/N): " -n 1 -r
echo # Move to a new line

if [[ $REPLY =~ ^[Yy]$ ]]; then
    INCLUDE_IP=true
    echo "👍 Okay, let's try to find your local network IP address..."
    # Try macOS detection first
    if command -v ipconfig &> /dev/null && [[ "$OSTYPE" == "darwin"* ]]; then
        echo "   (Checking macOS 'ipconfig' for en0/en1...)"
        DETECTED_IP=$(ipconfig getifaddr en0 || ipconfig getifaddr en1 || echo "")
    # Try Linux detection (should work on Ubuntu)
    elif command -v ip &> /dev/null && [[ "$OSTYPE" == "linux-gnu"* ]]; then
         echo "   (Checking Linux 'ip' command for global IPv4 address...)"
         # Get primary non-localhost IPv4 address using the 'ip' command
        DETECTED_IP=$(ip -4 addr show scope global | grep -oP 'inet \K[\d.]+' | head -n 1 || echo "")
    else
        echo "   (Could not determine OS or suitable command for automatic IP detection.)"
    fi

    if [ -n "$DETECTED_IP" ]; then
        echo "✅ Found IP: $DETECTED_IP"
        TARGET_NAMES="$DETECTED_IP $TARGET_NAMES" # Prepend detected IP
        echo "   Certificate will be valid for: $TARGET_NAMES"
    else
        echo "⚠️ Couldn't automatically detect your IP address."
        read -p "➡️ Please enter your primary local network IP address (e.g., 192.168.1.100): " USER_IP
        # Basic validation for IPv4 format
        if [[ "$USER_IP" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
            TARGET_NAMES="$USER_IP $TARGET_NAMES" # Prepend user IP
            DETECTED_IP=$USER_IP # Store user-provided IP for final instructions
            echo "✅ Okay, using IP: $USER_IP"
            echo "   Certificate will be valid for: $TARGET_NAMES"
        else
            echo "❌ Invalid IP address format entered ('$USER_IP')."
            echo "   Falling back to localhost only certificate."
            INCLUDE_IP=false # Revert flag
        fi
    fi
else
    echo "ℹ️ Skipping network IP. Certificate will be generated for localhost only."
    echo "   Certificate will be valid for: $TARGET_NAMES"
fi
echo ""

# --- 📜 4. Generating Certificates ---
echo "--- 📜 4. Generating Certificates ---"
echo "🚀 Asking mkcert to create the certificate files for: $TARGET_NAMES ..."

# Pass domains directly to mkcert (no eval needed)
mkcert $TARGET_NAMES
MKCERT_EXIT_CODE=$?

if [ $MKCERT_EXIT_CODE -ne 0 ]; then
    echo "❌ Error: mkcert failed to generate the certificates (Exit code: $MKCERT_EXIT_CODE)."
    echo "   Please check the output above for any specific errors from mkcert."
    echo "Aborting setup. 🛑"
    exit 1
fi

# --- ✨ Finding the New Files ---
echo "🔎 Identifying the newly generated certificate and key files..."
# Use ls -t to list files by modification time (newest first) and head -n 1.
# This assumes mkcert just created them and they are the newest *.pem files.
CERT_FILE=$(ls -t *.pem 2>/dev/null | grep -v -- '-key\.pem$' | head -n 1)
KEY_FILE=$(ls -t *-key.pem 2>/dev/null | head -n 1)

# Validate filenames were found
if [ -z "$CERT_FILE" ] || [ -z "$KEY_FILE" ]; then
    echo "❌ Error: Could not automatically find the generated certificate (.pem) or key (-key.pem) file."
    echo "   Did mkcert run successfully just now in this directory? Check the messages above."
    echo "   Look for files like 'localhost+*.pem' and 'localhost+*-key.pem'."
    echo "Aborting setup. 🛑"
    exit 1
fi

# Check if the found files actually exist (paranoid check)
if [ ! -f "$CERT_FILE" ] || [ ! -f "$KEY_FILE" ]; then
    echo "❌ Error: The identified certificate files ('$CERT_FILE', '$KEY_FILE') seem to be missing or unreadable."
    echo "   This is unexpected. Check file permissions or if the files were somehow removed."
    echo "Aborting setup. 🛑"
    exit 1
fi

echo "✅ Found certificate files!"
echo "   Certificate: $CERT_FILE"
echo "   Private Key: $KEY_FILE"
echo ""

# --- 📝 5. Updating package.json ---
echo "--- 📝 5. Updating package.json ---"
PACKAGE_JSON="package.json"
TEMP_PACKAGE_JSON="package.json.tmp"

if [ ! -f "$PACKAGE_JSON" ]; then
    echo "❌ Error: '$PACKAGE_JSON' not found in the current directory ($(pwd))."
    echo "   Are you in your project's root directory?"
    echo "Aborting setup. 🛑"
    exit 1
fi

echo "🚀 Updating the 'scripts.dev' command in '$PACKAGE_JSON' to use:"
echo "   Key file: '$KEY_FILE'"
echo "   Cert file: '$CERT_FILE'"

# Use jq to update the dev script, writing to a temporary file first
jq --arg cert "$CERT_FILE" --arg key "$KEY_FILE" \
   '.scripts.dev = "next dev --turbopack --experimental-https --experimental-https-key \($key) --experimental-https-cert \($cert)"' \
   "$PACKAGE_JSON" > "$TEMP_PACKAGE_JSON" 2> jq_error.log # Capture jq errors separately

# Check jq exit status and if the temp file was created and has content
if [ $? -ne 0 ] || [ ! -s "$TEMP_PACKAGE_JSON" ]; then
    echo "❌ Error: Failed to update '$PACKAGE_JSON' using jq."
    echo "   Reasons could be:"
    echo "   - '$PACKAGE_JSON' might have invalid JSON syntax."
    echo "   - You might lack write permissions in this directory."
    echo "   - The 'scripts.dev' path might not exist in your package.json."
    if [ -f jq_error.log ]; then
        echo "   --- JQ Error Log ---"
        cat jq_error.log
        echo "   --------------------"
        rm -f jq_error.log
    fi
    rm -f "$TEMP_PACKAGE_JSON" # Clean up empty/invalid temp file
    echo "Aborting setup. 🛑"
    exit 1
fi

# Remove the jq error log if jq succeeded
rm -f jq_error.log

# Replace original with updated file safely
mv "$TEMP_PACKAGE_JSON" "$PACKAGE_JSON"
if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to replace '$PACKAGE_JSON' with the updated version."
    echo "   Check directory permissions or if the file is locked."
    # Attempt to restore from temp if mv failed somehow, though unlikely
    [ -f "$TEMP_PACKAGE_JSON" ] && mv "$TEMP_PACKAGE_JSON" "$PACKAGE_JSON.update-failed"
    echo "Aborting setup. 🛑"
    exit 1
fi

echo "✅ '$PACKAGE_JSON' updated successfully!"
echo ""

# --- 📦 6. Installing Dependencies ---
echo "--- 📦 6. Installing Dependencies ---"
echo "🚀 Running 'npm install' to ensure all project dependencies are ready..."
npm install
if [ $? -ne 0 ]; then
    echo "⚠️ Warning: 'npm install' finished with errors."
    echo "   Please check the output above. Your project might not run correctly."
    # Continue, but warn the user
else
    echo "✅ Dependencies installed successfully."
fi
echo ""

# --- 🎉 7. Final Instructions ---
echo ""
echo "--- === --- === 🎉 Setup Complete! 🎉 === --- === ---"
echo ""
echo "✅ Success! Your local HTTPS development environment should be ready."
echo ""
echo "🚀 To start your development server:"
echo "   -------------------"
echo "   |   npm run dev   |"
echo "   -------------------"
echo ""
echo "🔗 Access your application at:"
echo "   ➡️  https://localhost:3000"

if $INCLUDE_IP; then
    # Use the IP we ended up with (detected or user-provided)
    IP_TO_USE=${DETECTED_IP:-$USER_IP}
    if [ -n "$IP_TO_USE" ]; then
        echo "   ➡️  https://$IP_TO_USE:3000  (for other devices on your network)"
        echo ""
        echo "*** 🚨 IMPORTANT FOR NETWORK ACCESS 🚨 ***"
        echo "To access from other devices (phones, tablets, other computers),"
        echo "you MUST install the mkcert root CA certificate ON THOSE DEVICES."
        echo ""
        echo "1. Find your CA certificate:"
        echo "   Run: mkcert -CAROOT"
        echo "   This will show a folder path. Go into that folder."
        echo ""
        echo "2. Copy the 'rootCA.pem' file from that folder to your other device(s)."
        echo ""
        echo "3. Install 'rootCA.pem' on the other device(s) as a trusted root certificate."
        echo "   (The process varies by OS - search online for 'install trusted root CA [device OS name]')"
        echo "*** -------------------------------- ***"
    fi
fi
echo ""
echo "ℹ️ Browser Warning:"
echo "   Your browser might still show a security warning the first time you visit"
echo "   because the certificate is self-signed (though trusted by your system)."
echo "   This is normal for development. You can usually proceed or add an exception."
echo ""
echo "-----------------------------------------"
echo "Happy coding with inteflow! ✨"
echo "-----------------------------------------"

exit 0