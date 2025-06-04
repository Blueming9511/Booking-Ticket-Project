import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react';

const RedirectPayment = () => {
  const [mounted, setMounted] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  // Simulate getting query params
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const status = queryParams.get('status');
    console.log('Payment status from query:', status);
    setPaymentStatus(status || 'pending');
    
    setTimeout(() => setMounted(true), 100);
  }, []);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'success':
        return {
          icon: CheckCircle,
          title: 'Thanh toán thành công!',
          message: 'Giao dịch của bạn đã được xử lý thành công.',
          bgGradient: 'from-green-900 via-black to-red-900',
          cardBg: 'from-green-800/20 to-red-800/20',
          iconColor: 'text-green-400',
          titleColor: 'text-green-300',
          borderColor: 'border-green-500/30',
          buttonBg: 'from-green-600 to-green-700 hover:from-green-700 hover:to-green-800',
          particles: 'success'
        };
      case 'fail':
        return {
          icon: XCircle,
          title: 'Thanh toán thất bại!',
          message: 'Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.',
          bgGradient: 'from-red-900 via-black to-red-900',
          cardBg: 'from-red-800/20 to-black/40',
          iconColor: 'text-red-400',
          titleColor: 'text-red-300',
          borderColor: 'border-red-500/30',
          buttonBg: 'from-red-600 to-red-700 hover:from-red-700 hover:to-red-800',
          particles: 'failed'
        };
      case 'pending':
        return {
          icon: Clock,
          title: 'Đang xử lý thanh toán...',
          message: 'Giao dịch của bạn đang được xử lý. Vui lòng đợi trong giây lát.',
          bgGradient: 'from-yellow-900 via-black to-red-900',
          cardBg: 'from-yellow-800/20 to-red-800/20',
          iconColor: 'text-yellow-400',
          titleColor: 'text-yellow-300',
          borderColor: 'border-yellow-500/30',
          buttonBg: 'from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800',
          particles: 'pending'
        };
      default:
        return {
          icon: Clock,
          title: 'Đang tải...',
          message: 'Vui lòng đợi...',
          bgGradient: 'from-gray-900 via-black to-gray-900',
          cardBg: 'from-gray-800/20 to-black/40',
          iconColor: 'text-gray-400',
          titleColor: 'text-gray-300',
          borderColor: 'border-gray-500/30',
          buttonBg: 'from-gray-600 to-gray-700',
          particles: 'default'
        };
    }
  };

  const config = getStatusConfig(paymentStatus);
  const Icon = config.icon;

  // Particle effect component
  const ParticleEffect = ({ type }) => {
    const particleCount = type === 'success' ? 20 : type === 'failed' ? 15 : 10;
    const particles = Array.from({ length: particleCount }, (_, i) => i);

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full animate-ping ${
              type === 'success' ? 'bg-green-400' : 
              type === 'failed' ? 'bg-red-400' : 'bg-yellow-400'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    );
  };

  const handleRetry = () => {
    // Simulate retry action
    const statuses = ['success', 'failed', 'pending'];
    const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
    setPaymentStatus(newStatus);
  };

  const handleGoBack = () => {
    // Simulate navigation back
    console.log('Navigating back...');
  };

  if (!paymentStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-400"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.bgGradient} flex items-center justify-center p-4 relative overflow-hidden`}>
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,0,0.1),transparent_50%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent,rgba(255,0,0,0.1),transparent)] animate-spin" style={{ animationDuration: '20s' }}></div>
      </div>

      {/* Particle effects */}
      <ParticleEffect type={config.particles} />

      {/* Main card */}
      <div className={`
        relative max-w-md w-full mx-auto transform transition-all duration-1000 ease-out
        ${mounted ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}
      `}>
        <div className={`
          bg-gradient-to-br ${config.cardBg} backdrop-blur-lg
          border ${config.borderColor} rounded-2xl p-8 shadow-2xl
          relative overflow-hidden
        `}>
          {/* Glowing border effect */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${config.borderColor.replace('border-', 'from-')} to-transparent opacity-20 animate-pulse`}></div>
          
          {/* Icon with animation */}
          <div className="text-center mb-6">
            <div className={`
              inline-flex items-center justify-center w-20 h-20 rounded-full
              bg-black/30 backdrop-blur-sm border ${config.borderColor}
              transform transition-all duration-1000 ease-out
              ${mounted ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}
              ${paymentStatus === 'pending' ? 'animate-spin' : ''}
            `}>
              <Icon className={`w-10 h-10 ${config.iconColor}`} />
            </div>
          </div>

          {/* Content */}
          <div className="text-center space-y-4">
            <h1 className={`text-2xl font-bold ${config.titleColor} transition-all duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
              {config.title}
            </h1>
            
            <p className={`text-gray-300 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
              {config.message}
            </p>

            {/* Status indicator */}
            <div className="flex items-center justify-center space-x-2 py-2">
              <div className={`w-2 h-2 rounded-full ${config.iconColor.replace('text-', 'bg-')} animate-pulse`}></div>
              <span className="text-sm text-gray-400 uppercase tracking-wider">
                {paymentStatus === 'success' ? 'Hoàn thành' : 
                 paymentStatus === 'failed' ? 'Thất bại' : 'Đang xử lý'}
              </span>
              <div className={`w-2 h-2 rounded-full ${config.iconColor.replace('text-', 'bg-')} animate-pulse`}></div>
            </div>
          </div>

          {/* Action buttons */}
          <div className={`mt-8 space-y-3 transition-all duration-1000 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {paymentStatus === 'success' && (
              <button
                onClick={handleGoBack}
                className={`
                  w-full px-6 py-3 rounded-lg font-medium text-white
                  bg-gradient-to-r ${config.buttonBg}
                  transform transition-all duration-200 hover:scale-105 active:scale-95
                  shadow-lg hover:shadow-xl
                  border border-green-500/20
                `}
              >
                Tiếp tục mua vé
              </button>
            )}

            {paymentStatus === 'failed' && (
              <>
                <button
                  onClick={handleRetry}
                  className={`
                    w-full px-6 py-3 rounded-lg font-medium text-white
                    bg-gradient-to-r ${config.buttonBg}
                    transform transition-all duration-200 hover:scale-105 active:scale-95
                    shadow-lg hover:shadow-xl
                    border border-red-500/20
                  `}
                >
                  Thử lại
                </button>
                <button
                  onClick={handleGoBack}
                  className="w-full px-6 py-3 rounded-lg font-medium text-gray-300 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/30 transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4 inline mr-2" />
                  Quay lại
                </button>
              </>
            )}

            {paymentStatus === 'pending' && (
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 text-yellow-300">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-yellow-400"></div>
                  <span className="text-sm">Đang xử lý...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-red-500/20 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-red-400/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Demo controls */}
      <div className="absolute top-4 right-4 space-x-2">
        <button
          onClick={() => setPaymentStatus('success')}
          className="px-3 py-1 bg-green-600/50 text-green-200 rounded text-sm hover:bg-green-600/70 transition-colors"
        >
          Success
        </button>
        <button
          onClick={() => setPaymentStatus('failed')}
          className="px-3 py-1 bg-red-600/50 text-red-200 rounded text-sm hover:bg-red-600/70 transition-colors"
        >
          Failed
        </button>
        <button
          onClick={() => setPaymentStatus('pending')}
          className="px-3 py-1 bg-yellow-600/50 text-yellow-200 rounded text-sm hover:bg-yellow-600/70 transition-colors"
        >
          Pending
        </button>
      </div>
    </div>
  );
};

export default RedirectPayment;