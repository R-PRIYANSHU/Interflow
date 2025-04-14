export default function BackgroundGradients() {
  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="absolute w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,_#00bcd4,_transparent_70%)] top-[-100px] left-[-100px] blur-[100px] opacity-30 animate-float1" />
      <div className="absolute w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,_#ff4081,_transparent_70%)] bottom-[-50px] right-[-80px] blur-[100px] opacity-30 animate-float2" />
      <div className="absolute w-[200px] h-[200px] rounded-full bg-[radial-gradient(circle,_#ffffff,_transparent_60%)] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 blur-[100px] opacity-5 animate-float3" />
    </div>
  );
}
