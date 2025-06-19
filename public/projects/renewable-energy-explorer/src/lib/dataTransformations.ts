export function getColorScale(domain: [number, number]) {
  const colors = ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'];
  return (value: number): string => {
    const normalized = (value - domain[0]) / (domain[1] - domain[0]);
    const index = Math.floor(normalized * (colors.length - 1));
    return colors[Math.max(0, Math.min(colors.length - 1, index))];
  };
}

export function formatValue(value: number): string {
  return value.toFixed(1) + '%';
} 