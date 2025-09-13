import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Camera, 
  Users, 
  Palette, 
  Zap, 
  Upload, 
  Sparkles,
  ArrowRight,
  Play,
  Download,
  Settings
} from 'lucide-react'
import './App.css'

// Import components
import ProductUpload from './components/ProductUpload'
import AvatarSelector from './components/AvatarSelector'
import SceneSelector from './components/SceneSelector'
import ContentGenerator from './components/ContentGenerator'
import Dashboard from './components/Dashboard'

function App() {
  const [currentStep, setCurrentStep] = useState('upload')
  const [productData, setProductData] = useState(null)
  const [selectedAvatar, setSelectedAvatar] = useState(null)
  const [selectedScene, setSelectedScene] = useState(null)
  const [generatedContent, setGeneratedContent] = useState([])

  // Initialize database on app load
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const response = await fetch('/api/init/database', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if (response.ok) {
          console.log('Database initialized successfully')
        }
      } catch (error) {
        console.error('Failed to initialize database:', error)
      }
    }

    initializeDatabase()
  }, [])

  const steps = [
    { id: 'upload', title: 'Upload Product', icon: Upload },
    { id: 'avatar', title: 'Select Avatar', icon: Users },
    { id: 'scene', title: 'Choose Scene', icon: Palette },
    { id: 'generate', title: 'Generate Content', icon: Sparkles }
  ]

  const LandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              StyleScape
            </span>
          </div>
          <Button 
            onClick={() => setCurrentStep('upload')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 bg-purple-100 text-purple-700 hover:bg-purple-200">
            AI-Powered Fashion Content
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Create Stunning Fashion Content in Minutes
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform your clothing designs into professional marketing content with AI-powered models, 
            scenes, and photorealistic rendering. No photoshoots required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => setCurrentStep('upload')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Creating
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How StyleScape Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our AI-powered platform transforms your product images into professional marketing content
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <Card key={step.id} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {step.id === 'upload' && 'Upload your product images and specify fabric details'}
                    {step.id === 'avatar' && 'Choose from diverse AI models or create custom avatars'}
                    {step.id === 'scene' && 'Select from professional backgrounds and lighting setups'}
                    {step.id === 'generate' && 'Generate high-quality images and videos instantly'}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Camera className="w-8 h-8 text-purple-600 mb-2" />
                <CardTitle>No Photoshoots Required</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Eliminate costly model bookings, photographers, and studio rentals. 
                  Create professional content from your product images.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Zap className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle>Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Generate marketing content in minutes, not days. 
                  Perfect for fast-moving fashion brands and seasonal collections.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Users className="w-8 h-8 text-indigo-600 mb-2" />
                <CardTitle>Diverse Representation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Showcase your products on models of all ethnicities, body types, 
                  and ages to reach broader audiences.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )

  const WorkflowPage = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                StyleScape
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => setCurrentStep('landing')}>
                Back to Home
              </Button>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = step.id === currentStep
              const isCompleted = steps.findIndex(s => s.id === currentStep) > index
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center space-x-3 ${
                    isActive ? 'text-purple-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-purple-100' : isCompleted ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {currentStep === 'upload' && (
          <ProductUpload 
            onNext={(data) => {
              setProductData(data)
              setCurrentStep('avatar')
            }}
          />
        )}
        {currentStep === 'avatar' && (
          <AvatarSelector 
            onNext={(avatar) => {
              setSelectedAvatar(avatar)
              setCurrentStep('scene')
            }}
            onBack={() => setCurrentStep('upload')}
          />
        )}
        {currentStep === 'scene' && (
          <SceneSelector 
            onNext={(scene) => {
              setSelectedScene(scene)
              setCurrentStep('generate')
            }}
            onBack={() => setCurrentStep('avatar')}
          />
        )}
        {currentStep === 'generate' && (
          <ContentGenerator 
            productData={productData}
            selectedAvatar={selectedAvatar}
            selectedScene={selectedScene}
            onGenerated={(content) => {
              setGeneratedContent([...generatedContent, content])
            }}
            onBack={() => setCurrentStep('scene')}
          />
        )}
      </main>
    </div>
  )

  return (
    <Router>
      <div className="App">
        {currentStep === 'landing' ? <LandingPage /> : <WorkflowPage />}
      </div>
    </Router>
  )
}

export default App

