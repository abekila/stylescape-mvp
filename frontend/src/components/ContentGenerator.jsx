import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft, 
  Sparkles, 
  Download, 
  Loader2, 
  Image, 
  Video, 
  Eye,
  RefreshCw,
  Share2
} from 'lucide-react'

const ContentGenerator = ({ productData, selectedAvatar, selectedScene, onGenerated, onBack }) => {
  const [poses, setPoses] = useState([])
  const [selectedPose, setSelectedPose] = useState('')
  const [contentType, setContentType] = useState('image')
  const [generating, setGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState([])
  const [currentGeneration, setCurrentGeneration] = useState(null)

  useEffect(() => {
    fetchPoses()
  }, [])

  const fetchPoses = async () => {
    try {
      const response = await fetch('/api/generate/poses')
      if (response.ok) {
        const data = await response.json()
        setPoses(data)
        if (data.length > 0) {
          setSelectedPose(data[0].name)
        }
      }
    } catch (error) {
      console.error('Error fetching poses:', error)
    }
  }

  const generateContent = async () => {
    if (!productData || !selectedAvatar || !selectedScene || !selectedPose) {
      alert('Missing required data for generation')
      return
    }

    setGenerating(true)
    setCurrentGeneration(null)

    try {
      const response = await fetch('/api/generate/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: productData.id,
          avatar_id: selectedAvatar.id,
          scene_id: selectedScene.id,
          content_type: contentType,
          pose: selectedPose,
          user_id: 1
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setCurrentGeneration(result)
        setGeneratedContent(prev => [result, ...prev])
        onGenerated(result)
      } else {
        alert('Failed to generate content')
      }
    } catch (error) {
      console.error('Generation error:', error)
      alert('Failed to generate content')
    } finally {
      setGenerating(false)
    }
  }

  const downloadContent = (contentUrl, filename) => {
    const link = document.createElement('a')
    link.href = contentUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Generate Content</h1>
        <p className="text-gray-600">
          Create professional marketing content with your selected product, model, and scene.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Generation Controls */}
        <div className="lg:col-span-1 space-y-6">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Generation Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Product</h4>
                <p className="text-sm text-gray-600">{productData?.name}</p>
                <div className="flex gap-1 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {productData?.fabric_type}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {productData?.fit}
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Model</h4>
                <p className="text-sm text-gray-600">{selectedAvatar?.name}</p>
                <Badge variant="secondary" className="text-xs">
                  {selectedAvatar?.gender} • {selectedAvatar?.age_range}
                </Badge>
              </div>

              <div>
                <h4 className="font-medium mb-2">Scene</h4>
                <p className="text-sm text-gray-600">{selectedScene?.name}</p>
                <Badge variant="secondary" className="text-xs">
                  {selectedScene?.category}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Generation Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Generation Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Content Type</label>
                <Tabs value={contentType} onValueChange={setContentType}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="image" className="flex items-center">
                      <Image className="w-4 h-4 mr-1" />
                      Image
                    </TabsTrigger>
                    <TabsTrigger value="video" className="flex items-center">
                      <Video className="w-4 h-4 mr-1" />
                      Video
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Pose</label>
                <Select value={selectedPose} onValueChange={setSelectedPose}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pose" />
                  </SelectTrigger>
                  <SelectContent>
                    {poses.map(pose => (
                      <SelectItem key={pose.name} value={pose.name}>
                        {pose.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={generateContent}
                disabled={generating || !selectedPose}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate {contentType === 'image' ? 'Image' : 'Video'}
                  </>
                )}
              </Button>

              {generating && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-medium text-blue-900 mb-1">AI Processing</h4>
                  <p className="text-sm text-blue-800">
                    Our AI is creating your content. This may take a few moments...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Generated Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Generated Content</span>
                {generatedContent.length > 0 && (
                  <Badge variant="secondary">
                    {generatedContent.length} generated
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Your AI-generated marketing content will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentGeneration && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">✓ Content Generated Successfully!</h4>
                  <p className="text-sm text-green-800 mb-3">
                    Your {currentGeneration.content_type} has been created and is ready for download.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => downloadContent(
                        currentGeneration.content_url, 
                        `stylescape-${currentGeneration.id}.${currentGeneration.content_type === 'image' ? 'png' : 'mp4'}`
                      )}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              )}

              {generatedContent.length === 0 && !generating ? (
                <div className="text-center py-12">
                  <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Ready to Generate</h3>
                  <p className="text-gray-600 mb-4">
                    Click the generate button to create your first piece of content.
                  </p>
                  <p className="text-sm text-gray-500">
                    The AI will combine your product, selected model, and scene to create 
                    professional marketing content.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedContent.map((content, index) => (
                    <Card key={content.id} className="border-l-4 border-l-purple-500">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            {content.content_type === 'image' ? (
                              <Image className="w-5 h-5 text-purple-600" />
                            ) : (
                              <Video className="w-5 h-5 text-purple-600" />
                            )}
                            <span className="font-medium">
                              {content.content_type === 'image' ? 'Image' : 'Video'} #{content.id}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {content.pose}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => downloadContent(
                                content.content_url, 
                                `stylescape-${content.id}.${content.content_type === 'image' ? 'png' : 'mp4'}`
                              )}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center mb-3">
                          {content.content_type === 'image' ? (
                            <Image className="w-12 h-12 text-gray-400" />
                          ) : (
                            <Video className="w-12 h-12 text-gray-400" />
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600">
                          Generated with {selectedAvatar?.name} in {selectedScene?.name}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Scene
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Start Over
          </Button>
          <Button 
            onClick={generateContent}
            disabled={generating}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate More
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ContentGenerator

