import React from 'react';
import { Plus, Target, Calendar, Trophy, ArrowRight, Trash2, Pencil } from 'lucide-react';
import { BudgetItem, SavingsGoal, TransactionType } from '../types.ts';

interface SavingsGoalsViewProps {
  goals: SavingsGoal[];
  items: BudgetItem[];
  symbol: string;
  onAddGoal: () => void;
  onEditGoal: (goal: SavingsGoal) => void;
  onDeleteGoal: (id: string) => void;
  onAddSavings: (goal: SavingsGoal) => void;
}

export const SavingsGoalsView: React.FC<SavingsGoalsViewProps> = ({ 
  goals, 
  items, 
  symbol,
  onAddGoal, 
  onEditGoal,
  onDeleteGoal, 
  onAddSavings 
}) => {
  const calculateProgress = (goal: SavingsGoal) => {
    const savingsFromTransactions = items
      .filter(item => 
        item.type === TransactionType.SAVING && 
        item.category === goal.category && 
        (!goal.subCategory || item.subCategory === goal.subCategory)
      )
      .reduce((sum, item) => sum + item.actualAmount, 0);

    const totalSaved = goal.initialAmount + savingsFromTransactions;
    const percentage = Math.min((totalSaved / goal.targetAmount) * 100, 100);
    const remaining = Math.max(goal.targetAmount - totalSaved, 0);
    
    return { totalSaved, percentage, remaining };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Savings Goals</h2>
        <button onClick={onAddGoal} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors">New Goal</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const { totalSaved, percentage, remaining } = calculateProgress(goal);
          return (
            <div key={goal.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 relative group transition-colors">
              <div className="absolute top-4 right-4 flex gap-2">
                <button onClick={() => onEditGoal(goal)} className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"><Pencil size={14} /></button>
                <button onClick={() => onDeleteGoal(goal.id)} className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"><Trash2 size={14} /></button>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm" style={{ backgroundColor: goal.color }}>
                  <Target size={20} />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100">{goal.name}</h3>
              </div>
              <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{symbol}{totalSaved.toLocaleString()}</span>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">of {symbol}{goal.targetAmount.toLocaleString()}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${percentage}%`, backgroundColor: goal.color }} />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 dark:text-slate-500">{symbol}{remaining.toLocaleString()} left</span>
                <button onClick={() => onAddSavings(goal)} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Add Funds</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};