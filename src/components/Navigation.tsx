import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, User, BarChart3 } from "lucide-react";

type TabType = 'clock' | 'overview' | 'profile' | 'reports';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const navigationItems = [
  { id: 'clock' as TabType, label: 'Tidur', icon: Clock },
  { id: 'overview' as TabType, label: 'Översikt', icon: Calendar },
  { id: 'reports' as TabType, label: 'Rapporter', icon: BarChart3 },
  { id: 'profile' as TabType, label: 'Profil', icon: User },
];

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  return (
    <nav className="bg-card border-t border-border shadow-lg">
      <div className="flex justify-around items-center py-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-1 h-16 px-4 transition-all duration-200 ${
                isActive 
                  ? 'text-primary bg-primary/10 border-t-2 border-t-primary' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};