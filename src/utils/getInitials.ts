export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/); // Split by spaces and remove extra whitespace

  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase(); // First letter of first and last names
  } else {
    return parts[0].slice(0, 2).toUpperCase(); // First two letters if only one name
  }
}
