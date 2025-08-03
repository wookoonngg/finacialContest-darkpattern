import React, { useState } from 'react';
import { Upload, AlertTriangle, CheckCircle, XCircle, Camera, Link } from 'lucide-react';

// 타입 정의
interface Pattern {
  type: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  location: string;
}

interface AnalysisResult {
  patternCount: number;
  riskScore: number;
  patterns: Pattern[];
  suggestions: string[];
}

// Mock 분석 결과 데이터
const mockAnalysisResults: Record<string, AnalysisResult> = {
  'sample1': {
    patternCount: 3,
    riskScore: 85,
    patterns: [
      {
        type: '강제 연속성',
        description: '자동 결제 갱신이 숨겨져 있음',
        severity: 'high',
        location: '결제 페이지 하단'
      },
      {
        type: '긴급성 조작',
        description: '타이머와 "마지막 기회" 문구 사용',
        severity: 'medium',
        location: '상품 페이지 상단'
      },
      {
        type: '숨겨진 비용',
        description: '배송비가 결제 직전에만 표시',
        severity: 'high',
        location: '체크아웃 페이지'
      }
    ],
    suggestions: [
      '자동 갱신 정책을 명확히 표시하세요',
      '실제 재고 상황을 정확히 안내하세요',
      '모든 비용을 초기에 투명하게 공개하세요'
    ]
  },
  'sample2': {
    patternCount: 1,
    riskScore: 35,
    patterns: [
      {
        type: '기본값 트릭',
        description: '뉴스레터 구독이 기본으로 체크됨',
        severity: 'low',
        location: '회원가입 폼'
      }
    ],
    suggestions: [
      '옵션 선택을 사용자에게 명시적으로 위임하세요'
    ]
  }
};

const PatternCard: React.FC<{ pattern: Pattern }> = ({ pattern }) => {
  const severityColors = {
    high: 'bg-red-100 border-red-300 text-red-800',
    medium: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    low: 'bg-green-100 border-green-300 text-green-800'
  };

  const severityIcons = {
    high: <XCircle className="w-5 h-5" />,
    medium: <AlertTriangle className="w-5 h-5" />,
    low: <CheckCircle className="w-5 h-5" />
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${severityColors[pattern.severity]}`}>
      <div className="flex items-center gap-2 mb-2">
        {severityIcons[pattern.severity]}
        <h3 className="font-semibold">{pattern.type}</h3>
      </div>
      <p className="text-sm mb-2">{pattern.description}</p>
      <div className="text-xs opacity-75">위치: {pattern.location}</div>
    </div>
  );
};

const ScoreDisplay: React.FC<{ score: number }> = ({ score }) => {
  const getScoreColor = (score: number): string => {
    if (score >= 70) return 'text-red-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getScoreText = (score: number): string => {
    if (score >= 70) return '위험';
    if (score >= 40) return '주의';
    return '양호';
  };

  return (
    <div className="text-center">
      <div className={`text-6xl font-bold ${getScoreColor(score)}`}>
        {score}
      </div>
      <div className="text-lg text-gray-600">위험 점수</div>
      <div className={`text-sm font-medium ${getScoreColor(score)}`}>
        {getScoreText(score)}
      </div>
    </div>
  );
};

function App(): JSX.Element {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [uploadMethod, setUploadMethod] = useState<'image' | 'url'>('image');

  const handleAnalysis = (sampleKey: string): void => {
    setIsAnalyzing(true);
    
    // Mock 분석 시뮬레이션 (2초 지연)
    setTimeout(() => {
      setAnalysisResult(mockAnalysisResults[sampleKey]);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files[0];
    if (file) {
      // 실제로는 랜덤하게 샘플 결과 중 하나를 선택
      const samples = Object.keys(mockAnalysisResults);
      const randomSample = samples[Math.floor(Math.random() * samples.length)];
      handleAnalysis(randomSample);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">다크패턴 감지기</h1>
          <p className="text-gray-600 text-sm">UX/UI에서 사용자를 속이는 디자인 패턴을 찾아드립니다</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {!analysisResult && !isAnalyzing && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* 업로드 방법 선택 */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setUploadMethod('image')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  uploadMethod === 'image' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
              >
                <Camera className="w-4 h-4" />
                이미지 업로드
              </button>
              <button
                onClick={() => setUploadMethod('url')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  uploadMethod === 'url' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
              >
                <Link className="w-4 h-4" />
                URL 입력
              </button>
            </div>

            {uploadMethod === 'image' && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  화면 캡처를 업로드하세요
                </h3>
                <p className="text-gray-500 mb-4">
                  웹페이지나 앱 화면을 캡처한 이미지를 분석합니다
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                >
                  파일 선택
                </label>
              </div>
            )}

            {uploadMethod === 'url' && (
              <div className="space-y-4">
                <input
                  type="url"
                  placeholder="분석할 웹페이지 URL을 입력하세요"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => handleAnalysis('sample1')}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
                >
                  분석 시작
                </button>
              </div>
            )}

            {/* 샘플 분석 버튼들 */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-medium mb-4">샘플로 체험해보기</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => handleAnalysis('sample1')}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                >
                  고위험 사이트 분석
                </button>
                <button
                  onClick={() => handleAnalysis('sample2')}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                >
                  저위험 사이트 분석
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 분석 중 로딩 */}
        {isAnalyzing && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">AI가 분석 중입니다...</h3>
            <p className="text-gray-500">다크패턴을 찾고 있어요</p>
          </div>
        )}

        {/* 분석 결과 */}
        {analysisResult && (
          <div className="space-y-6">
            {/* 점수 및 요약 */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <ScoreDisplay score={analysisResult.riskScore} />
                <div>
                  <h2 className="text-2xl font-bold mb-4">분석 결과</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>발견된 다크패턴:</span>
                      <span className="font-semibold">{analysisResult.patternCount}개</span>
                    </div>
                    <div className="flex justify-between">
                      <span>위험 수준:</span>
                      <span className={`font-semibold ${
                        analysisResult.riskScore >= 70 ? 'text-red-600' : 
                        analysisResult.riskScore >= 40 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {analysisResult.riskScore >= 70 ? '높음' : 
                         analysisResult.riskScore >= 40 ? '보통' : '낮음'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 발견된 패턴들 */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold mb-6">발견된 다크패턴</h3>
              <div className="grid gap-4">
                {analysisResult.patterns.map((pattern, index) => (
                  <PatternCard key={index} pattern={pattern} />
                ))}
              </div>
            </div>

            {/* 개선 제안 */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold mb-6">개선 제안</h3>
              <div className="space-y-3">
                {analysisResult.suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <p className="text-gray-700">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 다시 분석하기 버튼 */}
            <div className="text-center">
              <button
                onClick={() => setAnalysisResult(null)}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                새로운 분석 시작
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;