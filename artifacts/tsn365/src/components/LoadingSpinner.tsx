interface Props {
  text?: string;
}

export default function LoadingSpinner({ text = "Loading..." }: Props) {
  return (
    <div className="col-span-full py-12 flex flex-col items-center justify-center gap-4 text-gray-400">
      <div className="w-10 h-10 border-4 border-t-[#FF003C] border-white/10 rounded-full animate-spin"></div>
      <span>{text}</span>
    </div>
  );
}
