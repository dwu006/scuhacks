function Plants() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-600 mb-6">My Plants</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Plant cards will go here */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Plant Library</h2>
          <p className="text-gray-600">Coming soon: View and manage your plant collection</p>
        </div>
      </div>
    </div>
  );
}

export default Plants;
