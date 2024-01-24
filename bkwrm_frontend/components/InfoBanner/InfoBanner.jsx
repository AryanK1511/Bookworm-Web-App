import Head from 'next/head'

const InfoBanner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100">
      <Head>
        <title>Game API UI</title>
      </Head>

      <main className="container mx-auto py-16 px-6 md:px-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-16 text-gray-800">
          How do I play a game through a Web API?
        </h1>
        
        {/* Container for the cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card Function */}
          {Card('Community Support', 'We are a young platform with an active community of learners and builders working on very cool open source apps. Join our Discord to share your app or find help.')}
          {Card('Automation With Code', 'Our game presents a unique opportunity to automate your gameplay using any programming language you know or want to learn. Every action you can take in the game is an endpoint you can hit with code.')}
          {Card('Space Trading Game', 'Build a fleet of ships, explore the galaxy for hidden secrets, and automate trade routes. Join a faction to compete with other players for the best routes and the most credits.')}
          {Card('Dynamic Universe', 'SpaceTraders is both a learning platform as well as a dynamic game world with real balance and community-driven goals. Join a universe driven by player activity and cooperation.')}
          
        </div>
      </main>
    </div>
  )
}

// Card Component Function
const Card = (title, description) => (
  <div className="transform hover:scale-105 transition-transform duration-300 bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl">
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-indigo-700">{title}</h2>
      <p className="text-gray-700 text-base md:text-lg">
        {description}
      </p>
    </div>
  </div>
);

export default InfoBanner;
