import type { JobCardProps } from "app/interfaces/JobCard";


export const ServiceCard = ({ title, image, delay }: JobCardProps) => {
  return (
    <div 
      className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer w-sm"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-white text-xl font-semibold mb-3">{title}</h3>
        <button className="px-6 py-2 bg-white text-gray-900 rounded-full text-sm font-medium hover:bg-yellow-400 transition-colors">
          Ver mais
        </button>
      </div>
    </div>
  );
};