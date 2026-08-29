import { useState } from 'react';

const Skills = ({ skills }) => {
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});

  // Group skills by main category and sub-category
  const skillsByCategory = skills.reduce((acc, skill) => {
    const categoryParts = skill.category.split(' > ');
    const mainCategory = categoryParts[0] || skill.category;
    const subCategory = categoryParts[1] || null;

    if (!acc[mainCategory]) {
      acc[mainCategory] = {};
    }
    if (subCategory) {
      if (!acc[mainCategory][subCategory]) {
        acc[mainCategory][subCategory] = [];
      }
      acc[mainCategory][subCategory].push(skill);
    } else {
      if (!acc[mainCategory]['_uncategorized']) {
        acc[mainCategory]['_uncategorized'] = [];
      }
      acc[mainCategory]['_uncategorized'].push(skill);
    }
    return acc;
  }, {});

  const getProficiencyColor = (proficiency) => {
    switch (proficiency) {
      case 5:
        return 'bg-green-500';
      case 4:
        return 'bg-blue-500';
      case 3:
        return 'bg-yellow-500';
      case 2:
        return 'bg-orange-500';
      default:
        return 'bg-red-500';
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const selectMainCategory = (category) => {
    setSelectedMainCategory(category === selectedMainCategory ? null : category);
    setSelectedSubCategory(null);
  };

  const selectSubCategory = (subCategory) => {
    setSelectedSubCategory(subCategory === selectedSubCategory ? null : subCategory);
  };

  const getFilteredSkills = () => {
    if (!selectedMainCategory) return skillsByCategory;
    if (!selectedSubCategory) {
      return { [selectedMainCategory]: skillsByCategory[selectedMainCategory] };
    }
    return {
      [selectedMainCategory]: {
        [selectedSubCategory]: skillsByCategory[selectedMainCategory]?.[selectedSubCategory]
      }
    };
  };

  const filteredSkills = getFilteredSkills();

  return (
    <section id="skills" className="py-12 sm:py-20 px-4 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-slide-up">
          Skills & Expertise
        </h2>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <button
            onClick={() => { setSelectedMainCategory(null); setSelectedSubCategory(null); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !selectedMainCategory
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            All Skills
          </button>
          {Object.keys(skillsByCategory).map((category) => (
            <button
              key={category}
              onClick={() => selectMainCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedMainCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Sub-category Filter (only show when main category is selected) */}
        {selectedMainCategory && skillsByCategory[selectedMainCategory] && (
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {Object.keys(skillsByCategory[selectedMainCategory]).map((subCategory) => {
              if (subCategory === '_uncategorized') return null;
              return (
                <button
                  key={subCategory}
                  onClick={() => selectSubCategory(subCategory)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedSubCategory === subCategory
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {subCategory}
                </button>
              );
            })}
          </div>
        )}

        {Object.entries(filteredSkills).map(([mainCategory, subCategories], mainIndex) => (
          <div key={mainCategory} className="mb-8 sm:mb-12 animate-slide-up" style={{ animationDelay: `${mainIndex * 0.1}s` }}>
            <div 
              className="flex items-center justify-between cursor-pointer mb-4 sm:mb-6"
              onClick={() => toggleCategory(mainCategory)}
            >
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                {mainCategory}
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({Object.values(subCategories).flat().length})
                </span>
              </h3>
              <span className={`transform transition-transform ${expandedCategories[mainCategory] ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </div>
            
            {expandedCategories[mainCategory] !== false && (
              <>
                {Object.entries(subCategories).map(([subCategory, categorySkills], subIndex) => {
                  if (subCategory === '_uncategorized') {
                    // Skills without sub-category
                    return (
                      <div key="uncategorized" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {categorySkills.map((skill, skillIndex) => (
                          <div
                            key={skill.id}
                            className="bg-white dark:bg-gray-700 rounded-lg p-4 sm:p-6 shadow-md hover:shadow-lg transition-all"
                            style={{ animationDelay: `${mainIndex * 0.1 + skillIndex * 0.05}s` }}
                          >
                            <div className="flex justify-between items-center mb-2 sm:mb-3">
                              <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                                {skill.name}
                              </h4>
                              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                {skill.proficiency}/5
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 sm:h-2.5">
                              <div
                                className={`${getProficiencyColor(skill.proficiency)} h-2 sm:h-2.5 rounded-full transition-all duration-500 ease-out`}
                                style={{ width: `${(skill.proficiency / 5) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  
                  // Skills with sub-category
                  return (
                    <div key={subCategory} className="mb-6">
                      <h4 
                        className="text-lg font-medium mb-3 sm:mb-4 text-gray-800 dark:text-gray-200 pl-3 border-l-4 border-blue-500 cursor-pointer hover:border-blue-600 transition-colors"
                        onClick={() => selectSubCategory(subCategory)}
                      >
                        {subCategory}
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                          ({categorySkills.length})
                        </span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {categorySkills.map((skill, skillIndex) => (
                          <div
                            key={skill.id}
                            className="bg-white dark:bg-gray-700 rounded-lg p-4 sm:p-6 shadow-md hover:shadow-lg transition-all"
                            style={{ animationDelay: `${mainIndex * 0.1 + subIndex * 0.05 + skillIndex * 0.03}s` }}
                          >
                            <div className="flex justify-between items-center mb-2 sm:mb-3">
                              <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                                {skill.name}
                              </h4>
                              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                {skill.proficiency}/5
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 sm:h-2.5">
                              <div
                                className={`${getProficiencyColor(skill.proficiency)} h-2 sm:h-2.5 rounded-full transition-all duration-500 ease-out`}
                                style={{ width: `${(skill.proficiency / 5) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        ))}

        {skills.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
              No skills added yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;
