import { BookOpen, Users, Handshake, TrendingUp, Leaf, GraduationCap, Brain, Briefcase, Trophy, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const sdgGoals = [
  { number: 4, title: "Quality Education", color: "bg-red-600", icon: BookOpen },
  { number: 10, title: "Reduced Inequalities", color: "bg-pink-600", icon: Users },
  { number: 17, title: "Partnerships for the Goals", color: "bg-blue-900", icon: Handshake },
  { number: 8, title: "Decent Work and Economic Growth", color: "bg-red-700", icon: TrendingUp },
  { number: 13, title: "Climate Action", color: "bg-green-700", icon: Leaf },
];

const featureButtons = [
  { label: "Curriculum learning support", icon: GraduationCap },
  { label: "Confidence Building", icon: Heart },
  { label: "Skill Development", icon: Brain },
  { label: "Societal Impact", icon: Users },
  { label: "Future Job Preparation", icon: Briefcase },
  { label: "Boosted Exam Performance", icon: Trophy },
];

const SDGSection = () => {
  return (
    <section className="py-16 md:py-20 px-6 md:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-2">
            STEM Labs & Kits
          </h2>
          <p className="text-xl md:text-2xl font-serif tracking-widest text-foreground/80 uppercase">
            for every school
          </p>
        </div>

        {/* SDG Goals */}
        <div className="bg-green-100/60 rounded-3xl py-10 px-6 md:px-12 mb-10">
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {sdgGoals.map((goal) => (
              <button
                key={goal.number}
                className={`${goal.color} rounded-xl p-4 md:p-5 w-28 md:w-36 h-28 md:h-36 flex flex-col items-start justify-between text-white hover:scale-105 transition-transform shadow-lg`}
              >
                <div className="flex items-start gap-1">
                  <span className="text-2xl md:text-3xl font-bold">{goal.number}</span>
                  <span className="text-[8px] md:text-[10px] font-semibold leading-tight uppercase max-w-16">
                    {goal.title}
                  </span>
                </div>
                <goal.icon className="w-10 h-10 md:w-14 md:h-14 self-center opacity-90" />
              </button>
            ))}
          </div>
        </div>

        {/* Feature Buttons */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {featureButtons.map((feature) => (
            <Button
              key={feature.label}
              variant="outline"
              className="bg-green-600 hover:bg-green-700 text-white border-none rounded-full px-5 py-3 text-sm md:text-base font-medium shadow-md hover:shadow-lg transition-all"
            >
              <feature.icon className="w-4 h-4 mr-2" />
              {feature.label}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SDGSection;
