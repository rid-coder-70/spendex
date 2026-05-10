import React from 'react';
import { 
  Utensils, 
  Car, 
  Film, 
  Lightbulb, 
  ShoppingBag, 
  Stethoscope, 
  GraduationCap, 
  ShoppingCart, 
  Home, 
  ShieldCheck, 
  Plane, 
  Sparkles, 
  Gift, 
  DollarSign, 
  Briefcase, 
  Laptop, 
  LineChart, 
  Building2, 
  Wallet,
  Tag,
  Play,
  ShoppingBasket,
  Bus,
  PiggyBank
} from 'lucide-react';

interface CategoryIconProps {
  iconName: string | null | undefined;
  className?: string;
}

const iconMap: Record<string, any> = {
  // Lucide Names (normalized)
  'utensils': Utensils,
  'car': Car,
  'film': Film,
  'lightbulb': Lightbulb,
  'shopping-bag': ShoppingBag,
  'shoppingbag': ShoppingBag,
  'stethoscope': Stethoscope,
  'graduation-cap': GraduationCap,
  'graduationcap': GraduationCap,
  'shopping-cart': ShoppingCart,
  'shoppingcart': ShoppingCart,
  'shopping-basket': ShoppingBasket,
  'shoppingbasket': ShoppingBasket,
  'home': Home,
  'shield-check': ShieldCheck,
  'shieldcheck': ShieldCheck,
  'plane': Plane,
  'sparkles': Sparkles,
  'gift': Gift,
  'dollar-sign': DollarSign,
  'dollarsign': DollarSign,
  'briefcase': Briefcase,
  'laptop': Laptop,
  'line-chart': LineChart,
  'linechart': LineChart,
  'building-2': Building2,
  'building2': Building2,
  'wallet': Wallet,
  'play': Play,
  'bus': Bus,
  'piggy-bank': PiggyBank,
  'piggybank': PiggyBank,
  
  // Emojis to Lucide mapping
  '🍔': Utensils,
  '🚗': Car,
  '🎬': Film,
  '💡': Lightbulb,
  '🛍️': ShoppingBag,
  '🏥': Stethoscope,
  '📚': GraduationCap,
  '🛒': ShoppingCart,
  '🏠': Home,
  '🛡️': ShieldCheck,
  '✈️': Plane,
  '💆': Sparkles,
  '🎁': Gift,
  '💸': DollarSign,
  '💼': Briefcase,
  '💻': Laptop,
  '📈': LineChart,
  '🏢': Building2,
  '💰': Wallet,
};

export default function CategoryIcon({ iconName, className = "w-6 h-6" }: CategoryIconProps) {
  if (!iconName) {
    return <Tag className={className} />;
  }

  // Normalize icon name: lowercase, remove hyphens and spaces
  const normalizedName = iconName.toLowerCase().replace(/[-_ ]/g, '').trim();
  const IconComponent = iconMap[normalizedName] || iconMap[iconName.toLowerCase().trim()];

  if (IconComponent) {
    return <IconComponent className={className} />;
  }

  // Fallback to text if it's an emoji not in our map
  return <span className="text-xl leading-none">{iconName}</span>;
}
