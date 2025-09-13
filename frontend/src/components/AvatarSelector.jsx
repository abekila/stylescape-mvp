import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, ArrowLeft, Users, Loader2 } from 'lucide-react'

const AvatarSelector = ({ onNext, onBack }) => {
  const [avatars, setAvatars] = useState([])
  const [selectedAvatar, setSelectedAvatar] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAvatars()
  }, [])

  const fetchAvatars = async () => {
    try {
      const response = await fetch('/api/avatars')
      if (response.ok) {
        const data = await response.json()
        setAvatars(data)
      } else {
        console.error('Failed to fetch avatars')
      }
    } catch (error) {
      console.error('Error fetching avatars:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    if (selectedAvatar) {
      onNext(selectedAvatar)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p>Loading avatars...</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Choose Your Model</h1>
        <p className="text-gray-600">
          Select an AI model to showcase your product. Each model represents different demographics and styles.
        </p>
      </div>

      {avatars.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Avatars Available</h3>
            <p className="text-gray-600 mb-4">
              It looks like the avatar library hasn't been initialized yet.
            </p>
            <Button onClick={fetchAvatars}>
              Refresh
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {avatars.map((avatar) => (
              <Card 
                key={avatar.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedAvatar?.id === avatar.id 
                    ? 'ring-2 ring-purple-500 shadow-lg' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedAvatar(avatar)}
              >
                <CardHeader className="pb-3">
                  <div className="aspect-square bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg mb-3 flex items-center justify-center">
                    <Users className="w-12 h-12 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">{avatar.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="mb-3">
                    {avatar.description}
                  </CardDescription>
                  
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {avatar.gender}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {avatar.age_range}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs">
                        {avatar.ethnicity}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {avatar.body_type}
                      </Badge>
                    </div>
                  </div>

                  {selectedAvatar?.id === avatar.id && (
                    <div className="mt-3 p-2 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-700 font-medium">
                        ✓ Selected
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedAvatar && (
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-purple-600" />
                  Selected Model: {selectedAvatar.name}
                </CardTitle>
                <CardDescription>
                  {selectedAvatar.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-purple-100 text-purple-700">
                    {selectedAvatar.gender} • {selectedAvatar.age_range}
                  </Badge>
                  <Badge variant="outline">
                    {selectedAvatar.ethnicity}
                  </Badge>
                  <Badge variant="outline">
                    {selectedAvatar.body_type} build
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  This model will be used to showcase your product in the generated content. 
                  The AI will ensure proper fit and styling based on your product specifications.
                </p>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Product
            </Button>
            
            <Button 
              onClick={handleContinue}
              disabled={!selectedAvatar}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Continue to Scene Selection
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default AvatarSelector

