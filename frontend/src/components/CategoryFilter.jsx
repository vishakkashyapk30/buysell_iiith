import React from 'react';

const CategoryFilter = ({ selectedCategories, onCategoryChange }) => {
    const categories = [
        'clothing',
        'electronics',
        'books',
        'furniture',
        'grocery',
        'other'
    ];

    return (
        <div className="flex flex-wrap gap-4 mb-8">
            {categories.map(category => (
                <button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={`
                        px-4 py-2 
                        rounded-full 
                        font-medium
                        transition-colors
                        ${selectedCategories.includes(category)
                            ? 'bg-[#219EBC] text-white'
                            : 'bg-white text-[#023047] hover:bg-[#EFF2F3]'
                        }
                    `}
                >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
            ))}
        </div>
    );
};

export default CategoryFilter;