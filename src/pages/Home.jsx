function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">2MS Corporation</h1>
          <p className="text-xl">Your Trusted Business Partner</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to 2MS Corporation
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We provide innovative solutions and exceptional service to help your business thrive.
          </p>
        </section>

        {/* Features */}
        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-bold text-blue-600 mb-3">Quality Service</h3>
            <p className="text-gray-600">
              Dedicated to delivering excellence in everything we do.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-bold text-blue-600 mb-3">Expert Team</h3>
            <p className="text-gray-600">
              Experienced professionals committed to your success.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-bold text-blue-600 mb-3">Reliable Support</h3>
            <p className="text-gray-600">
              Always here when you need us, providing consistent support.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-blue-50 p-8 rounded-lg text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">Get in Touch</h3>
          <p className="text-lg text-gray-600">
            Contact us at:{" "}
            <a 
              href="mailto:contact@2mscorporation.com"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              contact@2mscorporation.com
            </a>
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-6xl mx-auto text-center px-4">
          <p>&copy; 2025 2MS Corporation. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home