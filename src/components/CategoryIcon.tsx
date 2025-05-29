
interface CategoryIconProps {
  category: string;
}

const CategoryIcon = ({ category }: CategoryIconProps) => {
  const getIconColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'web':
        return 'text-blue-400';
      case 'forensics':
        return 'text-green-400';
      case 'crypto':
        return 'text-yellow-400';
      case 'reverse':
        return 'text-orange-400';
      case 'misc':
        return 'text-pink-400';
      default:
        return 'text-gray-400';
    }
  };

  const colorClass = getIconColor(category);

  return (
    <div className={`inline-flex items-center justify-center w-4 h-4 ${colorClass}`}>
      {/* Pixel art screwdriver icon */}
      <svg 
        viewBox="0 0 16 16" 
        fill="currentColor" 
        className="w-4 h-4"
        style={{ imageRendering: 'pixelated' }}
      >
        <rect x="2" y="2" width="2" height="8" />
        <rect x="4" y="3" width="2" height="6" />
        <rect x="6" y="4" width="2" height="4" />
        <rect x="8" y="5" width="2" height="2" />
        <rect x="10" y="6" width="4" height="2" />
        <rect x="12" y="7" width="2" height="2" />
      </svg>
    </div>
  );
};

export default CategoryIcon;
