import React, { useState } from 'react';
// Corrected: Removed unused 'FileText' import
import { Upload, AlertTriangle, CheckCircle, XCircle, Info, FileVideo, Music, Image } from 'lucide-react';

const YouTubeCopyrightChecker = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    videoFile: null,
    audioFile: null,
    thumbnailFile: null,
    usesMusic: false,
    musicSource: '',
    hasVoiceover: false,
    usesFootage: false,
    footageSource: '',
    hasText: false,
    textSource: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (field, file) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const analyzeContent = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const results = {
      overallRisk: calculateOverallRisk(),
      issues: [],
      recommendations: [],
      contentAnalysis: {
        title: analyzeTitle(),
        description: analyzeDescription(),
        music: analyzeMusic(),
        footage: analyzeFootage(),
        thumbnail: analyzeThumbnail(),
        text: analyzeText()
      }
    };

    // Add issues based on analysis
    if (results.contentAnalysis.music.risk === 'high') {
      results.issues.push({
        type: 'music',
        severity: 'high',
        message: 'Potential copyrighted music detected',
        details: 'Commercial music tracks are often subject to copyright claims'
      });
    }

    if (results.contentAnalysis.footage.risk === 'medium') {
      results.issues.push({
        type: 'footage',
        severity: 'medium',
        message: 'Stock footage may require licensing',
        details: 'Verify that your footage is royalty-free or properly licensed'
      });
    }

    if (results.contentAnalysis.title.risk === 'medium') {
      results.issues.push({
        type: 'title',
        severity: 'medium',
        message: 'Title may contain trademarked terms',
        details: 'Consider using more generic terms to avoid potential issues'
      });
    }

    // Add recommendations
    results.recommendations = generateRecommendations(results);

    setAnalysisResults(results);
    setIsAnalyzing(false);
    setActiveTab('results');
  };

  const calculateOverallRisk = () => {
    let riskScore = 0;
    
    if (formData.usesMusic && formData.musicSource.includes('commercial')) riskScore += 30;
    if (formData.usesFootage && formData.footageSource.includes('stock')) riskScore += 20;
    if (formData.title.toLowerCase().includes('official') || formData.title.toLowerCase().includes('trailer')) riskScore += 25;
    
    // Corrected: Added parentheses to clarify logic
    if (formData.hasText && (formData.textSource.includes('book') || formData.textSource.includes('article'))) riskScore += 15;
    
    if (riskScore >= 50) return 'high';
    if (riskScore >= 25) return 'medium';
    return 'low';
  };

  const analyzeTitle = () => {
    const riskyWords = ['official', 'trailer', 'movie', 'disney', 'marvel', 'nintendo'];
    const hasRiskyWords = riskyWords.some(word => 
      formData.title.toLowerCase().includes(word.toLowerCase())
    );
    
    return {
      risk: hasRiskyWords ? 'medium' : 'low',
      details: hasRiskyWords ? 'Contains potentially trademarked terms' : 'Title appears safe'
    };
  };

  const analyzeDescription = () => {
    const copyrightKeywords = ['copyright', '©', 'all rights reserved', 'trademark'];
    const hasKeywords = copyrightKeywords.some(keyword => 
      formData.description.toLowerCase().includes(keyword.toLowerCase())
    );
    
    return {
      risk: 'low',
      details: hasKeywords ? 'Contains copyright-related terms - ensure proper attribution' : 'Description appears safe'
    };
  };

  const analyzeMusic = () => {
    if (!formData.usesMusic) return { risk: 'low', details: 'No music detected' };
    
    if (formData.musicSource.includes('commercial') || formData.musicSource.includes('popular')) {
      return { risk: 'high', details: 'Commercial music detected - high risk of copyright claims' };
    }
    
    if (formData.musicSource.includes('stock') || formData.musicSource.includes('royalty-free')) {
      return { risk: 'low', details: 'Royalty-free music - verify licensing terms' };
    }
    
    return { risk: 'medium', details: 'Music source unclear - verify copyright status' };
  };

  const analyzeFootage = () => {
    if (!formData.usesFootage) return { risk: 'low', details: 'Original footage only' };
    
    if (formData.footageSource.includes('movie') || formData.footageSource.includes('tv')) {
      return { risk: 'high', details: 'Movie/TV footage - likely copyrighted' };
    }
    
    if (formData.footageSource.includes('stock')) {
      return { risk: 'medium', details: 'Stock footage - verify licensing' };
    }
    
    return { risk: 'low', details: 'Footage source appears safe' };
  };

  const analyzeThumbnail = () => {
    return {
      risk: 'low',
      details: formData.thumbnailFile ? 'Custom thumbnail uploaded' : 'No custom thumbnail'
    };
  };

  const analyzeText = () => {
    if (!formData.hasText) return { risk: 'low', details: 'No external text content' };
    
    if (formData.textSource.includes('book') || formData.textSource.includes('article')) {
      return { risk: 'medium', details: 'Text from published works - verify fair use or permissions' };
    }
    
    return { risk: 'low', details: 'Text content appears original' };
  };

  const generateRecommendations = (results) => {
    const recommendations = [];
    
    if (results.overallRisk === 'high') {
      recommendations.push({
        priority: 'high',
        title: 'Consider Alternative Content',
        description: 'Your video has high copyright risk. Consider using royalty-free alternatives.'
      });
    }
    
    if (formData.usesMusic && formData.musicSource.includes('commercial')) {
      recommendations.push({
        priority: 'high',
        title: 'Replace Commercial Music',
        description: 'Use YouTube Audio Library, Creative Commons, or original music instead.'
      });
    }
    
    if (results.contentAnalysis.title.risk === 'medium') {
      recommendations.push({
        priority: 'medium',
        title: 'Modify Title',
        description: 'Remove trademarked terms and use more descriptive, original language.'
      });
    }
    
    recommendations.push({
      priority: 'low',
      title: 'Add Proper Attribution',
      description: 'Include credits and sources in your description for any third-party content.'
    });
    
    recommendations.push({
      priority: 'low',
      title: 'Monitor Content ID',
      description: 'Check for Content ID claims after upload and be prepared to dispute false positives.'
    });
    
    return recommendations;
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = (risk) => {
    switch (risk) {
      case 'high': return <XCircle className="w-5 h-5" />;
      case 'medium': return <AlertTriangle className="w-5 h-5" />;
      case 'low': return <CheckCircle className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">YouTube Copyright Checker</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Analyze your content for potential copyright issues before uploading to YouTube. 
              Get actionable recommendations to protect your channel.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex mb-8 bg-white rounded-lg shadow-sm p-1">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === 'upload'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Content Analysis
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === 'results'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              disabled={!analysisResults}
            >
              Results & Recommendations
            </button>
          </div>

          {/* Content Analysis Tab */}
          {activeTab === 'upload' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">Upload Content for Analysis</h2>
              
              {/* Basic Information */}
              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter your video title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter your video description"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter tags separated by commas"
                  />
                </div>
              </div>

              {/* File Uploads */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
                  <FileVideo className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Upload Video File</p>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileUpload('videoFile', e.target.files[0])}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload" className="cursor-pointer text-red-600 hover:text-red-700 font-medium">
                    Choose File
                  </label>
                  {formData.videoFile && (
                    <p className="text-xs text-gray-500 mt-1">{formData.videoFile.name}</p>
                  )}
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
                  <Music className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Upload Audio File</p>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => handleFileUpload('audioFile', e.target.files[0])}
                    className="hidden"
                    id="audio-upload"
                  />
                  <label htmlFor="audio-upload" className="cursor-pointer text-red-600 hover:text-red-700 font-medium">
                    Choose File
                  </label>
                  {formData.audioFile && (
                    <p className="text-xs text-gray-500 mt-1">{formData.audioFile.name}</p>
                  )}
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
                  <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Upload Thumbnail</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('thumbnailFile', e.target.files[0])}
                    className="hidden"
                    id="thumbnail-upload"
                  />
                  <label htmlFor="thumbnail-upload" className="cursor-pointer text-red-600 hover:text-red-700 font-medium">
                    Choose File
                  </label>
                  {formData.thumbnailFile && (
                    <p className="text-xs text-gray-500 mt-1">{formData.thumbnailFile.name}</p>
                  )}
                </div>
              </div>

              {/* Content Details */}
              <div className="space-y-6">
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.usesMusic}
                      onChange={(e) => handleInputChange('usesMusic', e.target.checked)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Video contains music</span>
                  </label>
                  {formData.usesMusic && (
                    <div className="mt-2 ml-6">
                      <select
                        value={formData.musicSource}
                        onChange={(e) => handleInputChange('musicSource', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="">Select music source</option>
                        <option value="original">Original composition</option>
                        <option value="royalty-free">Royalty-free/Creative Commons</option>
                        <option value="stock">Licensed stock music</option>
                        <option value="commercial">Commercial/Popular music</option>
                        <option value="youtube-library">YouTube Audio Library</option>
                      </select>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.usesFootage}
                      onChange={(e) => handleInputChange('usesFootage', e.target.checked)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Video contains third-party footage</span>
                  </label>
                  {formData.usesFootage && (
                    <div className="mt-2 ml-6">
                      <select
                        value={formData.footageSource}
                        onChange={(e) => handleInputChange('footageSource', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="">Select footage source</option>
                        <option value="original">All original footage</option>
                        <option value="stock">Stock footage</option>
                        <option value="creative-commons">Creative Commons</option>
                        <option value="movie">Movie/TV clips</option>
                        <option value="news">News footage</option>
                        <option value="user-generated">User-generated content</option>
                      </select>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.hasText}
                      onChange={(e) => handleInputChange('hasText', e.target.checked)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Video contains text from external sources</span>
                  </label>
                  {formData.hasText && (
                    <div className="mt-2 ml-6">
                      <select
                        value={formData.textSource}
                        onChange={(e) => handleInputChange('textSource', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="">Select text source</option>
                        <option value="original">Original writing</option>
                        <option value="public-domain">Public domain</option>
                        <option value="creative-commons">Creative Commons</option>
                        <option value="book">Book excerpts</option>
                        <option value="article">Article/News content</option>
                        <option value="lyrics">Song lyrics</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Analyze Button */}
              <div className="mt-8">
                <button
                  onClick={analyzeContent}
                  disabled={!formData.title || isAnalyzing}
                  className="w-full bg-red-600 text-white py-3 px-6 rounded-md font-medium hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Analyzing Content...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      <span>Analyze for Copyright Issues</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Results Tab */}
          {activeTab === 'results' && analysisResults && (
            <div className="space-y-6">
              {/* Overall Risk Assessment */}
              <div className={`rounded-lg border p-6 ${getRiskColor(analysisResults.overallRisk)}`}>
                <div className="flex items-center space-x-3 mb-4">
                  {getRiskIcon(analysisResults.overallRisk)}
                  <h2 className="text-xl font-semibold">
                    Overall Risk: {analysisResults.overallRisk.charAt(0).toUpperCase() + analysisResults.overallRisk.slice(1)}
                  </h2>
                </div>
                <p className="text-sm">
                  {analysisResults.overallRisk === 'high' && 'Your content has significant copyright risks. Review the recommendations below before uploading.'}
                  {analysisResults.overallRisk === 'medium' && 'Your content has some potential copyright issues. Consider the recommendations to reduce risk.'}
                  {analysisResults.overallRisk === 'low' && 'Your content appears to have minimal copyright risks. Review recommendations for best practices.'}
                </p>
              </div>

              {/* Detailed Analysis */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Detailed Content Analysis</h3>
                <div className="grid gap-4">
                  {Object.entries(analysisResults.contentAnalysis).map(([key, analysis]) => (
                    <div key={key} className={`p-4 rounded-lg border ${getRiskColor(analysis.risk)}`}>
                      <div className="flex items-center space-x-2 mb-2">
                        {getRiskIcon(analysis.risk)}
                        <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      </div>
                      <p className="text-sm">{analysis.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Issues Found */}
              {analysisResults.issues.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 text-red-600">Issues Found</h3>
                  <div className="space-y-4">
                    {analysisResults.issues.map((issue, index) => (
                      <div key={index} className="border-l-4 border-red-400 pl-4 py-2">
                        <div className="flex items-center space-x-2 mb-1">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <span className="font-medium text-red-700">{issue.message}</span>
                        </div>
                        <p className="text-sm text-gray-600">{issue.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
                <div className="space-y-4">
                  {analysisResults.recommendations.map((rec, index) => (
                    <div key={index} className={`p-4 rounded-lg border-l-4 ${
                      rec.priority === 'high' ? 'border-red-400 bg-red-50' :
                      rec.priority === 'medium' ? 'border-yellow-400 bg-yellow-50' :
                      'border-blue-400 bg-blue-50'
                    }`}>
                      <h4 className="font-medium mb-2">{rec.title}</h4>
                      <p className="text-sm text-gray-600">{rec.description}</p>
                      <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                        rec.priority === 'high' ? 'bg-red-200 text-red-800' :
                        rec.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-blue-200 text-blue-800'
                      }`}>
                        {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)} Priority
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Resources */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Additional Resources</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Corrected: Replaced href="#" with actual URLs */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium mb-2">YouTube Audio Library</h4>
                    <p className="text-sm text-gray-600 mb-2">Free music and sound effects for your videos</p>
                    <a href="https://www.youtube.com/audiolibrary/" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700 text-sm font-medium">Visit Library →</a>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium mb-2">Copyright Guidelines</h4>
                    <p className="text-sm text-gray-600 mb-2">Learn about YouTube's copyright policies</p>
                    <a href="https://support.google.com/youtube/answer/2797466" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700 text-sm font-medium">Read Guidelines →</a>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium mb-2">Fair Use Guidelines</h4>
                    <p className="text-sm text-gray-600 mb-2">Understand when fair use may apply</p>
                    <a href="https://www.youtube.com/about/copyright/fair-use/" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700 text-sm font-medium">Learn More →</a>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium mb-2">Creative Commons</h4>
                    <p className="text-sm text-gray-600 mb-2">Find freely usable content</p>
                    <a href="https://creativecommons.org/" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700 text-sm font-medium">Browse Content →</a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YouTubeCopyrightChecker;