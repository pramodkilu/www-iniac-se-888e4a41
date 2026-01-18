import { Button } from "@/components/ui/button";
import { Trophy, Users, Calendar, MapPin, Award, Zap, Target, Clock } from "lucide-react";
import roboligaCover from "@/assets/roboliga-cover.jpg";
import roboligaStudents from "@/assets/roboliga-students.jpg";

const RoboLigaSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/30 mb-6">
            <Trophy className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold text-sm">Sweden's School Robotics League</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            SweSkola <span className="text-primary">RoboLiga</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
            Bringing Schools Together Through Robotics — Experience Learning Through Play
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center mb-16">
          {/* Left - Image & Quick Info */}
          <div className="space-y-6">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <img 
                src={roboligaStudents} 
                alt="Students building robots at SweSkola RoboLiga" 
                className="w-full aspect-video object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white text-sm md:text-base font-medium">
                  From elementary to college — participants build real robots, not simulations!
                </p>
              </div>
            </div>
            
            {/* Origin Badge */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <p className="text-slate-300 text-sm">
                <span className="text-primary font-semibold">🌍 From India to Sweden:</span> Originally hosted at Techfest, IIT Bombay with 1,000+ participants. 
                Now expanding to Västerås, Sweden!
              </p>
            </div>
          </div>

          {/* Right - Details */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Target className="w-6 h-6 text-primary" />
                Competition Structure
              </h3>
              
              <div className="space-y-6">
                {/* Stage 1 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">School-Level Workshop</h4>
                    <p className="text-slate-400 text-sm">Teams build and program robots to complete challenges. 2-hour sessions in February 2026.</p>
                  </div>
                </div>
                
                {/* Stage 2 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">City Finals</h4>
                    <p className="text-slate-400 text-sm">All qualified teams compete at ABB venue in Västerås on March 21, 2026. Evaluated by robotics experts!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Prize Info */}
            <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/30">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-white font-semibold">Cash Prizes</p>
                  <p className="text-yellow-200 text-sm">SEK 2,000 for Junior + Senior category winners!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Junior Category */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-primary/50 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">ROBO-SPRINT</h4>
                <p className="text-blue-400 text-sm font-medium">Junior Category (up to 15 years)</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm">
              Air-hockey style ball passing challenge! Pass as many balls as possible into the opponent's area. 
              3-minute rounds — the team with fewer balls wins!
            </p>
          </div>

          {/* Senior Category */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-primary/50 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">ROBO-RACE</h4>
                <p className="text-purple-400 text-sm font-medium">Senior Category (15+ years)</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm">
              Navigate the arena, collect objects, and deposit them quickly! Test your robot's speed, 
              precision, and strategy in this exciting race challenge.
            </p>
          </div>
        </div>

        {/* Event Details */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-10">
          <div className="flex items-center gap-2 text-slate-300">
            <Calendar className="w-5 h-5 text-primary" />
            <span>Finals: March 21, 2026</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="w-5 h-5 text-primary" />
            <span>Västerås, Sweden</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Users className="w-5 h-5 text-primary" />
            <span>Teams of 2-4 students</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-5 h-5 text-primary" />
            <span>Workshops: Feb 2026</span>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-lg shadow-primary/30"
          >
            Register Your School
          </Button>
          <p className="text-slate-400 text-sm mt-4">
            Powered by <span className="text-primary font-semibold">INIAC</span> × <span className="font-semibold">Blix-A-Then</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default RoboLigaSection;
