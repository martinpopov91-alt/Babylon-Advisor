import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Target, Trash2 } from 'lucide-react';
import { SavingsGoal, TransactionType, Category } from '../types.ts';

interface AddGoalModalProps {
  isOpen: boolean;
  symbol: string;
  onClose: () => void;
  onSave: (goal: Omit<SavingsGoal, 'id'>) => void;
  initialData?: SavingsGoal | null;
  onDelete?: () => void;
  categories: Category[];
}

const COLORS = [
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#6366F1', // Indigo
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#64748B', // Slate
];

export const AddGoalModal: React.FC<AddGoalModalProps> = ({ isOpen, symbol, onClose, onSave, initialData, onDelete, categories }) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [initialAmount, setInitialAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [color, setColor] = useState(COLORS[0]);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setTargetAmount(initialData.targetAmount.toString());
        setInitialAmount(initialData.initialAmount.toString());
        setDeadline(initialData.deadline || '');
        setCategory(initialData.category);
        setSubCategory(initialData.subCategory || '');
        setColor(initialData.color);
      } else {
        setName('');
        setTargetAmount('');
        setInitialAmount('0');
        setDeadline('');
        setCategory('');
        setSubCategory('');
        setColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount || !category) return;

    onSave({
      name,
      targetAmount: parseFloat(targetAmount),
      initialAmount: parseFloat(initialAmount) || 0,
      deadline: deadline || undefined,
      category,
      subCategory: subCategory || undefined,
      color
    });
    onClose();
  };

  const savingsCategories = categories.filter(c => c.types.includes(TransactionType.SAVING));
  const selectedCategoryDef = categories.find(c => c.name === category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-semibold text-lg text-slate-800 flex items-center gap-2">
            <Target size={20} className="text-indigo-600"/>
            {initialData ? 'Edit Savings Goal' : 'New Savings Goal'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-200">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Goal Name</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="e.g. Dream House"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Target Amount ({symbol})</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="10000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Starting Balance ({symbol})</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="0"
                value={initialAmount}
                onChange={(e) => setInitialAmount(e.target.value)}
              />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Target Deadline</label>
             <input
              type="date"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Link to Category</label>
            <div className="relative mb-2">
              <select
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white appearance-none"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSubCategory('');
                }}
              >
                <option value="">Select Category</option>
                {savingsCategories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            
            {selectedCategoryDef?.subCategories && selectedCategoryDef.subCategories.length > 0 && (
              <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                <label className="block text-xs font-medium text-slate-500 mb-1">Subcategory (Optional)</label>
                <div className="flex flex-wrap gap-2">
                  {selectedCategoryDef.subCategories.map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setSubCategory(sub === subCategory ? '' : sub)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        subCategory === sub 
                          ? 'bg-indigo-100 border-indigo-500 text-indigo-700' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Color Tag</label>
            <div className="flex gap-3">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${color === c ? 'ring-2 ring-offset-2 ring-slate-400' : ''}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            {initialData && onDelete && (
                <button 
                  type="button" 
                  onClick={onDelete}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-bold bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
            )}
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-sm"
            >
              {initialData ? 'Save Changes' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};