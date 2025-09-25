import type { ServiceCardProps } from "~/interfaces/ServiceCardProp";

export function ServiceCard({ icon, title, description }: ServiceCardProps) {
  return (
    <div className="bg-gray-200 p-6 rounded-xl shadow-md flex flex-col gap-3 max-w-sm">
      <div className="flex items-center gap-2 text-lg font-semibold">
        {icon}
        <span>{title}</span>
      </div>
      <p className="text-sm text-gray-800 leading-relaxed">{description}</p>
    </div>
  );
}