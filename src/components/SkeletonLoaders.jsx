export default function GameCardSkeleton() {
  return (
    <div className="bg-gray-800/40 rounded-xl overflow-hidden border border-gray-700/50 animate-pulse">
      <div className="relative h-48 bg-gray-700/50" />
      
      <div className="p-4">
        <div className="h-6 bg-gray-700/50 rounded mb-3 w-3/4" />
        
        <div className="flex gap-2 mb-3">
          <div className="h-6 bg-gray-700/50 rounded w-16" />
          <div className="h-6 bg-gray-700/50 rounded w-20" />
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
          <div className="h-5 bg-gray-700/50 rounded w-16" />
          <div className="h-8 bg-gray-700/50 rounded w-8" />
        </div>
      </div>
    </div>
  );
}

export function GameDetailSkeleton() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-indigo-950 to-purple-900">
      <div className="max-w-7xl mx-auto px-6 py-12 animate-pulse">
        <div className="h-8 bg-gray-700/50 rounded w-48 mb-8" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-96 bg-gray-700/50 rounded-2xl" />
            <div className="h-6 bg-gray-700/50 rounded w-3/4" />
            <div className="h-4 bg-gray-700/50 rounded w-full" />
            <div className="h-4 bg-gray-700/50 rounded w-5/6" />
          </div>
          
          <div className="space-y-6">
            <div className="bg-gray-800/40 rounded-2xl p-6">
              <div className="h-32 bg-gray-700/50 rounded mb-4" />
              <div className="space-y-3">
                <div className="h-4 bg-gray-700/50 rounded" />
                <div className="h-4 bg-gray-700/50 rounded" />
                <div className="h-4 bg-gray-700/50 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
