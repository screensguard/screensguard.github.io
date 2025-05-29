import Header from "@/components/Header";
import WriteupCard from "@/components/WriteupCard";

// Sample data for recent writeups
const recentWriteups = [
  {
    id: "jigboy",
    title: "JigBoy",
    category: "forensics",
    description: "Jigboy, the superhero, possesses the remarkable ability to reel in colossal fish from the depths of the deep blue sea.",
    date: "2024-01-25"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-gray-100 flex flex-col">
      <Header />
      
      <div className="flex-grow">
        {/* Hero Section - Made Smaller */}
        <section className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            {/* Profile Image */}
            <img 
              src="/images/ascii_art.png" 
              alt="screenguard profile" 
              className="w-24 h-24 mx-auto rounded-full object-cover shadow-lg"
            />
            
            {/* Name and Description */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
              screenguard
            </h1>
            <p className="text-lg text-gray-300 max-w-xl mx-auto leading-relaxed">
              :3
            </p>
          </div>
        </section>

        {/* Recent Writeups Section */}
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-100 mb-3">Recent Writeups</h2>
            <p className="text-gray-400">
              
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1 max-w-4xl mx-auto">
            {recentWriteups.map((writeup, index) => (
              <WriteupCard
                key={index}
                id={writeup.id}
                title={writeup.title}
                category={writeup.category}
                description={writeup.description}
                date={writeup.date}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black py-6">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-400 text-sm">© screenguard 2025. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
