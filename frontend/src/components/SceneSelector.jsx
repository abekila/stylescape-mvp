import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, ArrowLeft, Palette, Loader2, Sun, Camera, Trees, Building } from 'lucide-react'

const SceneSelector = ({ onNext, onBack }) => {
  const [scenes, setScenes] = useState([])
  const [selectedScene, setSelectedScene] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchScenes()
  }, [])

  const fetchScenes = async () => {
    try {
      const response = await fetch('/api/scenes')
      if (response.ok) {
        const data = await response.json()
        setScenes(data)
      } else {
        console.error('Failed to fetch scenes')
      }
    } catch (error) {
      console.error('Error fetching scenes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    if (selectedScene) {
      onNext(selectedScene)
    }
  }

  const getSceneIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'urban':
        return Building
      case 'nature':
        return Trees
      case 'studio':
        return Camera
      default:
        return Palette
    }
  }

  const getLightingIcon = (lighting) => {
    switch (lighting?.toLowerCase()) {
      case 'golden hour':
        return Sun
      default:
        return Sun
    }
  }

  const categories = ['all', ...new Set(scenes.map(scene => scene.category?.toLowerCase()).filter(Boolean))]
  const filteredScenes = filter === 'all' 
    ? scenes 
    : scenes.filter(scene => scene.category?.toLowerCase() === filter)

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p>Loading scenes...</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Choose Your Scene</h1>
        <p className="text-gray-600">
          Select a background environment that complements your product and brand aesthetic.
        </p>
      </div>

      {scenes.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Palette className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Scenes Available</h3>
            <p className="text-gray-600 mb-4">
              It looks like the scene library hasn't been initialized yet.
            </p>
            <Button onClick={fetchScenes}>
              Refresh
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <Button
                key={category}
                variant={filter === category ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(category)}
                className={filter === category ? "bg-purple-600 hover:bg-purple-700" : ""}
              >
                {category === 'all' ? 'All Scenes' : category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredScenes.map((scene) => {
              const SceneIcon = getSceneIcon(scene.category)
              const LightingIcon = getLightingIcon(scene.lighting_preset)
              
              return (
                <Card 
                  key={scene.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedScene?.id === scene.id 
                      ? 'ring-2 ring-purple-500 shadow-lg' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedScene(scene)}
                >
                  <CardHeader className="pb-3">
                    <div className="aspect-video bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                      <SceneIcon className="w-12 h-12 text-purple-600" />
                      <div className="absolute top-2 right-2">
                        <LightingIcon className="w-5 h-5 text-yellow-500" />
                      </div>
                    </div>
                    <CardTitle className="text-lg">{scene.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="mb-3">
                      {scene.description}
                    </CardDescription>
                    
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {scene.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {scene.lighting_preset}
                        </Badge>
                      </div>
                    </div>

                    {selectedScene?.id === scene.id && (
                      <div className="mt-3 p-2 bg-purple-50 rounded-lg">
                        <p className="text-sm text-purple-700 font-medium">
                          ✓ Selected
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {selectedScene && (
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="w-5 h-5 mr-2 text-blue-600" />
                  Selected Scene: {selectedScene.name}
                </CardTitle>
                <CardDescription>
                  {selectedScene.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-blue-100 text-blue-700">
                    {selectedScene.category}
                  </Badge>
                  <Badge variant="outline">
                    {selectedScene.lighting_preset} lighting
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  This scene will provide the background environment for your product showcase. 
                  The AI will ensure proper lighting and composition to highlight your garment.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-medium text-blue-900 mb-1">Scene Features</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Professional {selectedScene.lighting_preset.toLowerCase()} lighting</li>
                    <li>• {selectedScene.category} environment aesthetic</li>
                    <li>• Optimized for fashion photography</li>
                    <li>• High-resolution background rendering</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Avatar
            </Button>
            
            <Button 
              onClick={handleContinue}
              disabled={!selectedScene}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Continue to Generation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default SceneSelector

