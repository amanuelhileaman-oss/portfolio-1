import { motion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa6';
import { ExternalLink, FolderGit2, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { TiltCard } from './ui/tilt-card';

const Projects = ({ projects = [] }) => {
  return (
    <section id="projects" className="py-16 sm:py-24 px-4 relative overflow-hidden">
      {/* Decorative subtle background accents */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3 border border-primary/20 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Portfolio Showcase</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
            A showcase of full-stack web applications and software projects I've built, focusing on clean code, scalable architecture, and modern user experiences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <TiltCard className="h-full">
                <Card className="h-full flex flex-col overflow-hidden border-border/80 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 bg-card/85 backdrop-blur-sm group">
                  {project.image_url ? (
                    <div className="h-44 sm:h-48 overflow-hidden relative bg-muted">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ) : (
                    <div className="h-32 sm:h-36 bg-gradient-to-br from-primary/10 via-accent/30 to-background flex items-center justify-center border-b border-border/60">
                      <FolderGit2 className="w-10 h-10 text-primary/40 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  )}

                  <CardHeader className="p-5 pb-2">
                    <CardTitle className="text-lg sm:text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">
                      {project.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-5 pt-1 flex-grow">
                    <CardDescription className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                      {project.description}
                    </CardDescription>
                  </CardContent>

                  {project.github_link && (
                    <CardFooter className="p-5 pt-0">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full gap-2 border-border/80 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 rounded-lg font-medium"
                      >
                        <a
                          href={project.github_link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaGithub className="w-4 h-4" />
                          <span>View Source Code</span>
                        </a>
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </TiltCard>
            </motion.div>
          ))}

          {projects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-16 px-4 bg-muted/20 border border-dashed border-border rounded-2xl"
            >
              <FolderGit2 className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground text-base sm:text-lg font-medium">
                No projects yet. More coming soon!
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Projects;