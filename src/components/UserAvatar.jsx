export default function UserAvatar({ image, name }) {
  if (image) return <img src={image} alt={name} className="w-10 h-10 rounded-full" />;
  return <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">{name?.slice(0,1)}</div>;
}
