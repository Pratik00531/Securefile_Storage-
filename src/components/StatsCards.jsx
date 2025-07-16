import React from 'react';
import { Files, HardDrive, Upload, Share2, TrendingUp } from 'lucide-react';

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Files',
      value: stats.totalFiles,
      icon: Files,
      color: 'blue',
      change: '+2.1%',
      changeType: 'increase'
    },
    {
      title: 'Storage Used',
      value: stats.totalSize,
      icon: HardDrive,
      color: 'green',
      change: '+5.4%',
      changeType: 'increase'
    },
    {
      title: 'Recent Uploads',
      value: stats.recentUploads,
      icon: Upload,
      color: 'purple',
      change: '+12.5%',
      changeType: 'increase'
    },
    {
      title: 'Shared Files',
      value: stats.sharedFiles,
      icon: Share2,
      color: 'orange',
      change: '+3.2%',
      changeType: 'increase'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600 font-medium">{card.change}</span>
                  <span className="text-xs text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg border ${getColorClasses(card.color)}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
