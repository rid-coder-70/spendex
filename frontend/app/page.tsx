import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-12">
            <div className="text-7xl mb-6">💰</div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to SpendGuard
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8">
              Your intelligent personal finance manager. Track expenses, analyze spending, and achieve your financial goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="px-8 py-4 bg-white text-primary-800 rounded-lg font-semibold text-lg hover:bg-primary-50 transition-colors"
              >
                Get Started Free
              </Link>
              <Link
                href="/auth/login"
                className="px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold text-lg hover:bg-primary-500 transition-colors border-2 border-white/20"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Track Expenses</h3>
              <p className="text-primary-100">
                Upload CSV files or add transactions manually to keep track of all your spending
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold mb-2">View Analytics</h3>
              <p className="text-primary-100">
                Get insights into your spending patterns with beautiful charts and reports
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold mb-2">Detect Subscriptions</h3>
              <p className="text-primary-100">
                Automatically identify recurring payments and manage your subscriptions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}