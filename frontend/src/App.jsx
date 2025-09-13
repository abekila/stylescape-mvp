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
  Settings,
  Star,
  CheckCircle
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="container mx-auto px-6 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-green-600">
              StyleScape
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-gray-900">Product</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Pricing</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Resources</a>
            <Button variant="outline" className="mr-2">
              Login
            </Button>
            <Button 
              onClick={() => setCurrentStep('upload')}
              className="bg-gray-900 hover:bg-gray-800 text-white"
            >
              Try Now
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Create <em className="italic text-gray-700">stunning</em><br />
              fashion photos with<br />
              AI generated models
            </h1>
            <p className="text-xl text-gray-600 max-w-lg">
              StyleScape is perfect for fashion brands that value quality, speed, and flexibility. 
              Bring your products to life at a fraction of the cost.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={() => setCurrentStep('upload')}
                className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg"
              >
                Try Now
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="px-8 py-4 text-lg border-gray-300"
              >
                Available on Shopify App Store
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Fashion model"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-sm text-gray-600">
              Created with StyleScape ✨
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How <em className="italic text-gray-700">StyleScape</em> works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            No creative skills required - just a few clicks and you've got realistic stunning photos. 
            Experience the magic of StyleScape's AI-powered fashion photography today.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Upload className="w-8 h-8 text-gray-700" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Upload</h3>
            <p className="text-gray-600">
              Upload the images of your products
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-gray-700" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">2. Transform</h3>
            <p className="text-gray-600">
              Select the model and background
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Download className="w-8 h-8 text-gray-700" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">3. Share</h3>
            <p className="text-gray-600">
              Add to your website, social media profile or digital campaign
            </p>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="container mx-auto px-6 py-16">
        <div className="bg-gray-900 rounded-3xl p-8 md:p-12">
          <div className="bg-white rounded-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-green-600">StyleScape</span>
              </div>
              <div className="text-sm text-gray-500">All Credits: 50</div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Let's get started</h3>
            <p className="text-gray-600 mb-8">
              You can now create your first project! Simply choose the type of photo you want to upload, either an on-model photo or a packshot.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-gray-300 cursor-pointer">
                <div className="w-full h-48 bg-gray-50 rounded-lg mb-4 flex items-center justify-center">
                  <Camera className="w-12 h-12 text-gray-400" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">On-Model photos</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Start by uploading on-model photos, switch to easily the model or the background
                </p>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Start Creating →
                </Button>
              </div>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-gray-300 cursor-pointer">
                <div className="w-full h-48 bg-gray-50 rounded-lg mb-4 flex items-center justify-center">
                  <Upload className="w-12 h-12 text-gray-400" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Flat lays photos</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Start by uploading packshot photos, switch to easily the model or the background
                </p>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Start Creating →
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-8 space-x-4">
          <Button 
            size="lg" 
            onClick={() => setCurrentStep('upload')}
            className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4"
          >
            Try Now
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="px-8 py-4 border-gray-300"
          >
            Available on Shopify App Store
          </Button>
        </div>
      </section>

      {/* Trust Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-12">
          Trusted by thousands of fashion brands
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
          {/* Brand logos would go here - using placeholder text for now */}
          <div className="text-gray-400 font-semibold">ZARA</div>
          <div className="text-gray-400 font-semibold">H&M</div>
          <div className="text-gray-400 font-semibold">UNIQLO</div>
          <div className="text-gray-400 font-semibold">BEBE</div>
          <div className="text-gray-400 font-semibold">NIKE</div>
          <div className="text-gray-400 font-semibold">ADIDAS</div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-gray-900 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              With StyleScape's AI fashion models, our customers achieve
            </h3>
          </div>
          <div className="grid md:grid-cols-5 gap-8 text-center text-white">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">-85%</div>
              <div className="text-gray-300">Visual production costs</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">10x</div>
              <div className="text-gray-300">Faster time to market</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">+15%</div>
              <div className="text-gray-300">In conversion rates</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">+20%</div>
              <div className="text-gray-300">Average order value</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">+35%</div>
              <div className="text-gray-300">In ad click-through rates</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            StyleScape's AI fashion models will revolutionize <em className="italic text-gray-700">your</em> business
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            StyleScape makes creating amazing images of your clothing a breeze, and affordable. 
            Our AI generated models for fashion allow you to:
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <Card className="p-8 border-0 shadow-lg">
            <CardHeader className="p-0 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Camera className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Skip the shoots</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <CardDescription className="text-gray-600 text-lg leading-relaxed">
                Generate stunning, professional photos & launch collections in no time. 
                No studios, no crews - cut costs by 90% without sacrificing quality.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="p-8 border-0 shadow-lg">
            <CardHeader className="p-0 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Play className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Turn static photos into fashion videos</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <CardDescription className="text-gray-600 text-lg leading-relaxed">
                Bring your fashion to life with AI generated video. Show how your products move, 
                fit, and feel - so customers can buy with confidence.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="p-8 border-0 shadow-lg">
            <CardHeader className="p-0 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">More models, bigger reach</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <CardDescription className="text-gray-600 text-lg leading-relaxed">
                Feature various looks and styles without hiring dozens of models. 
                Get access to an exclusive and diverse AI model portfolio.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="p-8 border-0 shadow-lg">
            <CardHeader className="p-0 mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Full image rights included</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <CardDescription className="text-gray-600 text-lg leading-relaxed">
                Use your photos anytime, anywhere. No fees, no headaches - just freedom.
              </CardDescription>
            </CardContent>
          </Card>
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
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-green-600">
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
                    isActive ? 'text-green-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-green-100' : isCompleted ? 'bg-green-100' : 'bg-gray-100'
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

