interface ProgressRingProps {
  value: number;
  size: number;
  strokeWidth: number;
  color?: string;
  backgroundColor?: string;
}

export function ProgressRing({ 
  value, 
  size, 
  strokeWidth, 
  color = "#3D5AFE", 
  backgroundColor = "#E0E0E0" 
}: ProgressRingProps) {
  // Calculate properties for the SVG
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  
  return (
    <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
      {/* Background circle */}
      <circle
        className="transition-all duration-300 ease-in-out"
        stroke={backgroundColor}
        strokeWidth={strokeWidth}
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      {/* Progress circle */}
      <circle
        className="transition-all duration-300 ease-in-out"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={offset}
        strokeLinecap="round"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        style={{
          transform: "rotate(-90deg)",
          transformOrigin: "center",
        }}
      />
      {/* Text in the middle */}
      {size >= 40 && (
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="font-mono font-semibold text-sm fill-neutral-500"
        >
          {value}%
        </text>
      )}
    </svg>
  );
}
