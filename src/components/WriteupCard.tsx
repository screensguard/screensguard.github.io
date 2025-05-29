import React from "react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faScrewdriver,
  faLaptopCode, 
  faMagnifyingGlass, 
  faLock, 
  faGears, 
  faShieldHalved 
} from "@fortawesome/free-solid-svg-icons";

interface WriteupCardProps {
  id: string;
  title: string;
  category: string;
  description: string;
  date: string;
}

const WriteupCard = ({ id, title, category, description, date }: WriteupCardProps) => {
  const getCategoryStyle = (cat: string): { icon: any; color: string } => {
    switch (cat.toLowerCase()) {
      case 'web':
        return {
          icon: faLaptopCode,
          color: 'text-blue-400'
        };
      case 'forensics':
        return {
          icon: faScrewdriver,
          color: 'text-green-400'
        };
      case 'crypto':
        return {
          icon: faLock,
          color: 'text-yellow-400'
        };
      case 'reverse':
        return {
          icon: faGears,
          color: 'text-orange-400'
        };
      case 'misc':
        return {
          icon: faShieldHalved,
          color: 'text-pink-400'
        };
      default:
        return {
          icon: faShieldHalved,
          color: 'text-gray-400'
        };
    }
  };

  const categoryStyle = getCategoryStyle(category);

  return (
    <Link to={`/writeups/${id}`} className="block">
      <div className="group bg-transparent border border-transparent rounded-lg p-6 hover:border-gray-600 transition-all duration-200 cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-100 line-clamp-2">
            {title}
          </h3>
          <span className="text-sm text-gray-400 whitespace-nowrap ml-4">{date}</span>
        </div>
        <div className="mb-3">
          <Badge className="bg-transparent border border-gray-700 hover:bg-transparent px-3 py-1">
            <FontAwesomeIcon 
              icon={categoryStyle.icon} 
              className={`${categoryStyle.color} mr-2 w-4 h-4`}
            />
            <span className={categoryStyle.color}>
              {category}
            </span>
          </Badge>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>
    </Link>
  );
};

export default WriteupCard;
