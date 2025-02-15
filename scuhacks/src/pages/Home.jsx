function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">Welcome to GardenVision</h1>
        <p className="text-xl text-gray-600 mb-8">
          Track, monitor, and optimize your garden's growth with AI-powered insights
        </p>
        <div className="flex justify-center space-x-4">
          <a href="/signin" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
            Get Started
          </a>
          <a href="/garden" className="border border-green-600 text-green-600 px-6 py-3 rounded-lg hover:bg-green-50">
            Explore Garden
          </a>
        </div>
      </div>
    </div>
  );
}

export default Home;
