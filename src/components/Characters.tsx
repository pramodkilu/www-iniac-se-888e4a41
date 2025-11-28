import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const characters = [
  {
    name: "Laya",
    role: "The Curious Builder",
    description: "Loves asking questions and experimenting with new ideas!",
    color: "from-primary to-primary-glow"
  },
  {
    name: "Kit",
    role: "The Problem Solver",
    description: "Always ready with a clever solution and a helping hand.",
    color: "from-secondary to-success"
  },
  {
    name: "Robb",
    role: "The Creative Thinker",
    description: "Sees connections everywhere and loves to innovate!",
    color: "from-accent to-primary"
  }
];

const Characters = () => {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Meet Your Learning Buddies</h2>
          <p className="text-xl text-muted-foreground">Laya, Kit, and Robb will guide you on your STEM journey!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {characters.map((character, index) => (
            <Card 
              key={character.name}
              className="hover:scale-105 transition-transform duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className={`w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br ${character.color} flex items-center justify-center text-4xl font-bold text-white shadow-lg`}>
                  {character.name[0]}
                </div>
                <CardTitle className="text-2xl text-center">{character.name}</CardTitle>
                <CardDescription className="text-center font-semibold text-foreground/80">
                  {character.role}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">{character.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Characters;
