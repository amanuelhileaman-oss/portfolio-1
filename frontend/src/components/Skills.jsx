import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ChevronDown, Sparkles } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

const Skills = ({ skills = [] }) => {
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

  const getProficiencyLabel = (proficiency) => {
    switch (proficiency) {
      case 5:
        return 'Expert';
      case 4:
        return 'Advanced';
      case 3:
        return 'Intermediate';
      case 2:
        return 'Novice';
      default:
        return 'Beginner';
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
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
        [selectedSubCategory]: skillsByCategory[selectedMainCategory]?.[selectedSubCategory],
      },
    };
  };

  const filteredSkills = getFilteredSkills();

  return (
    <section id="skills" className="py-16 sm:py-24 px-4 bg-muted/30 dark:bg-muted/10 relative overflow-hidden">
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Tech Stack & Tools</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Skills & Expertise
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
            A comprehensive overview of my technical proficiencies and competencies.
          </p>
        </motion.div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <Button
            variant={!selectedMainCategory ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSelectedMainCategory(null);
              setSelectedSubCategory(null);
            }}
            className="rounded-full text-xs sm:text-sm font-medium transition-all"
          >
            All Skills
          </Button>
          {Object.keys(skillsByCategory).map((category) => (
            <Button
              key={category}
              variant={selectedMainCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => selectMainCategory(category)}
              className="rounded-full text-xs sm:text-sm font-medium transition-all"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Sub-category Filter */}
        {selectedMainCategory && skillsByCategory[selectedMainCategory] && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 mb-8 justify-center"
          >
            {Object.keys(skillsByCategory[selectedMainCategory]).map((subCategory) => {
              if (subCategory === '_uncategorized') return null;
              return (
                <Button
                  key={subCategory}
                  variant={selectedSubCategory === subCategory ? "gradient" : "secondary"}
                  size="sm"
                  onClick={() => selectSubCategory(subCategory)}
                  className="rounded-full text-xs h-7 px-3 font-medium transition-all"
                >
                  {subCategory}
                </Button>
              );
            })}
          </motion.div>
        )}

        {Object.entries(filteredSkills).map(([mainCategory, subCategories], mainIndex) => (
          <motion.div
            key={mainCategory}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: mainIndex * 0.08 }}
            className="mb-10 sm:mb-14"
          >
            <div
              className="flex items-center justify-between cursor-pointer mb-5 p-2 rounded-lg hover:bg-muted/50 transition-colors group select-none"
              onClick={() => toggleCategory(mainCategory)}
            >
              <h3 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-3">
                <span>{mainCategory}</span>
                <Badge variant="secondary" className="text-xs">
                  {Object.values(subCategories).flat().length}
                </Badge>
              </h3>
              <div
                className={`p-1.5 rounded-md text-muted-foreground group-hover:text-foreground group-hover:bg-accent transition-all transform ${
                  expandedCategories[mainCategory] ? 'rotate-180' : ''
                }`}
              >
                <ChevronDown className="w-5 h-5" />
              </div>
            </div>

            <AnimatePresence initial={false}>
              {expandedCategories[mainCategory] !== false && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {Object.entries(subCategories).map(([subCategory, categorySkills]) => {
                    if (subCategory === '_uncategorized') {
                      return (
                        <div
                          key="uncategorized"
                          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6"
                        >
                          {categorySkills.map((skill) => (
                            <motion.div
                              key={skill.id}
                              whileHover={{ y: -4, scale: 1.02 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Card
                                className="h-full border-border/70 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 bg-card/85 backdrop-blur-sm group"
                              >
                                <CardContent className="p-5">
                                  <div className="flex justify-between items-center mb-3">
                                    <h4 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                                      {skill.name}
                                    </h4>
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-[11px] py-0 px-2 group-hover:border-primary/40">
                                        {getProficiencyLabel(skill.proficiency)}
                                      </Badge>
                                      <span className="text-xs font-mono font-medium text-muted-foreground">
                                        {skill.proficiency}/5
                                      </span>
                                    </div>
                                  </div>
                                  <div className="w-full bg-secondary/80 rounded-full h-2 overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      whileInView={{ width: `${(skill.proficiency / 5) * 100}%` }}
                                      viewport={{ once: true }}
                                      transition={{ duration: 0.8, ease: "easeOut" }}
                                      className={`${getProficiencyColor(skill.proficiency)} h-2 rounded-full group-hover:shadow-[0_0_12px_rgba(59,130,246,0.5)] transition-shadow duration-300`}
                                    />
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      );
                    }

                    return (
                      <div key={subCategory} className="mb-6">
                        <div
                          className="text-base sm:text-lg font-semibold mb-3.5 text-foreground/90 pl-3 border-l-4 border-primary/80 cursor-pointer hover:text-primary transition-colors inline-flex items-center gap-2"
                          onClick={() => selectSubCategory(subCategory)}
                        >
                          <span>{subCategory}</span>
                          <span className="text-xs text-muted-foreground font-normal">
                            ({categorySkills.length})
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                          {categorySkills.map((skill) => (
                            <motion.div
                              key={skill.id}
                              whileHover={{ y: -4, scale: 1.02 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Card
                                className="h-full border-border/70 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 bg-card/85 backdrop-blur-sm group"
                              >
                                <CardContent className="p-5">
                                  <div className="flex justify-between items-center mb-3">
                                    <h4 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                                      {skill.name}
                                    </h4>
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-[11px] py-0 px-2 group-hover:border-primary/40">
                                        {getProficiencyLabel(skill.proficiency)}
                                      </Badge>
                                      <span className="text-xs font-mono font-medium text-muted-foreground">
                                        {skill.proficiency}/5
                                      </span>
                                    </div>
                                  </div>
                                  <div className="w-full bg-secondary/80 rounded-full h-2 overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      whileInView={{ width: `${(skill.proficiency / 5) * 100}%` }}
                                      viewport={{ once: true }}
                                      transition={{ duration: 0.8, ease: "easeOut" }}
                                      className={`${getProficiencyColor(skill.proficiency)} h-2 rounded-full group-hover:shadow-[0_0_12px_rgba(59,130,246,0.5)] transition-shadow duration-300`}
                                    />
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        {skills.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 px-4 bg-muted/20 border border-dashed border-border rounded-2xl"
          >
            <Award className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground text-base sm:text-lg font-medium">
              No skills added yet.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Skills;
