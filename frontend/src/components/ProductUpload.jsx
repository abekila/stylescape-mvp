import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, Image, ArrowRight, Loader2 } from 'lucide-react'

const ProductUpload = ({ onNext }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    fabric_type: '',
    fit: '',
    size: '',
    image_url: ''
  })
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [analysis, setAnalysis] = useState('')

  const fabricTypes = [
    'Cotton', 'Denim', 'Silk', 'Wool', 'Polyester', 'Linen', 
    'Leather', 'Cashmere', 'Spandex', 'Rayon'
  ]

  const fitTypes = ['Slim', 'Regular', 'Oversized', 'Tight', 'Loose']
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setUploading(true)
    
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)

      const response = await fetch('/api/products/upload', {
        method: 'POST',
        body: formDataUpload,
      })

      if (response.ok) {
        const result = await response.json()
        setFormData(prev => ({ ...prev, image_url: result.image_url }))
        setUploadedImage(result.image_url)
      } else {
        alert('Failed to upload image')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const analyzeGarment = async () => {
    if (!uploadedImage || !formData.fabric_type || !formData.fit) {
      alert('Please upload an image and select fabric type and fit first')
      return
    }

    setAnalyzing(true)
    
    try {
      const response = await fetch('/api/generate/analyze-garment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: uploadedImage,
          fabric_type: formData.fabric_type,
          fit: formData.fit
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setAnalysis(result.analysis)
      } else {
        alert('Failed to analyze garment')
      }
    } catch (error) {
      console.error('Analysis error:', error)
      alert('Failed to analyze garment')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.fabric_type || !formData.fit || !formData.size || !uploadedImage) {
      alert('Please fill in all required fields and upload an image')
      return
    }

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const product = await response.json()
        onNext(product)
      } else {
        alert('Failed to create product')
      }
    } catch (error) {
      console.error('Submit error:', error)
      alert('Failed to create product')
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Upload Your Product</h1>
        <p className="text-gray-600">
          Start by uploading images of your garment and providing basic details
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Image className="w-5 h-5 mr-2" />
              Product Image
            </CardTitle>
            <CardDescription>
              Upload a high-quality image of your garment (front view recommended)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                {uploadedImage ? (
                  <div className="space-y-4">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded product" 
                      className="max-w-full h-48 object-contain mx-auto rounded-lg"
                    />
                    <p className="text-sm text-green-600">Image uploaded successfully!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium">Upload product image</p>
                      <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-4"
                  disabled={uploading}
                />
                {uploading && (
                  <div className="flex items-center justify-center mt-2">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span className="text-sm">Uploading...</span>
                  </div>
                )}
              </div>

              {uploadedImage && formData.fabric_type && formData.fit && (
                <Button 
                  onClick={analyzeGarment} 
                  disabled={analyzing}
                  variant="outline"
                  className="w-full"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Analyzing with AI...
                    </>
                  ) : (
                    'Analyze Garment with AI'
                  )}
                </Button>
              )}

              {analysis && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">AI Analysis</h4>
                  <p className="text-sm text-blue-800">{analysis}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Product Details Form */}
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>
              Provide information about your garment for accurate AI processing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Classic Cotton T-Shirt"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the product..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fabric_type">Fabric Type *</Label>
                  <Select 
                    value={formData.fabric_type} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, fabric_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select fabric" />
                    </SelectTrigger>
                    <SelectContent>
                      {fabricTypes.map(fabric => (
                        <SelectItem key={fabric} value={fabric.toLowerCase()}>
                          {fabric}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="fit">Fit *</Label>
                  <Select 
                    value={formData.fit} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, fit: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select fit" />
                    </SelectTrigger>
                    <SelectContent>
                      {fitTypes.map(fit => (
                        <SelectItem key={fit} value={fit.toLowerCase()}>
                          {fit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="size">Size *</Label>
                <Select 
                  value={formData.size} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, size: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {sizes.map(size => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                disabled={!uploadedImage || !formData.name || !formData.fabric_type || !formData.fit || !formData.size}
              >
                Continue to Avatar Selection
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ProductUpload

