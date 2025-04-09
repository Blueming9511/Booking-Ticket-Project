import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Button,
  Typography,
  Spin,
  message,
  Image as AntdImage,
  // Descriptions removed as not used
  Tag,
  ConfigProvider,
  Select,
  Alert,
  Divider,
} from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { formatPrice } from '../utils/dateUtils'; // Assuming utils path
import api from '../utils/api'; // Assuming utils path

// VNPay logo URL
const vnpayLogoUrl =
  'https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const PaymentModal = ({
  visible,
  onClose,
  bookingDetails,
  onPaymentSuccess,
}) => {
  // --- State ---
  const [processing, setProcessing] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [allCouponDetails, setAllCouponDetails] = useState({});
  const [selectedCouponCode, setSelectedCouponCode] = useState(null);
  const [couponError, setCouponError] = useState(null);
  const [isFetchingCoupons, setIsFetchingCoupons] = useState(false);

  // --- Derived Data ---
  const {
    movieTitle = 'N/A',
    seats = [], // Expecting array of objects: { seatCode, price, type }
    totalPrice: initialTotalPrice = 0, // This is the subtotal BEFORE coupon
    startTime = 'N/A',
    date = 'N/A',
    screenCode = 'N/A',
    showtimeCode = null, // Needed for booking details
    cinemaName = 'N/A',
    // Using placeholder userCode - REPLACE with actual user ID from auth/context
    userCode = '67ef3c10b50a606c784293b8',
  } = bookingDetails || {};

  const displayDate = useMemo(
    () =>
      date
        ? new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })
        : 'N/A',
    [date]
  );

  // --- Fetch Coupons ---
  useEffect(() => {
    // Reset state function
    const resetState = () => {
      setSelectedCouponCode(null);
      setCouponError(null);
      setCoupons([]);
      setAllCouponDetails({});
      setProcessing(false);
      setIsFetchingCoupons(false);
    }

    if (visible) {
      const fetchCoupons = async () => {
        setIsFetchingCoupons(true);
        setCouponError(null);
        try {
          // --- Verify '/api/coupons' endpoint ---
          const response = await api.get('/api/coupons');
          // --- Adjust data extraction based on your API response structure ---
          const fetchedCoupons = Array.isArray(response.data?.data)
            ? response.data.data
            : Array.isArray(response.data)
            ? response.data
            : [];

          const detailsMap = {};
          const options = fetchedCoupons.map((coupon) => {
            detailsMap[coupon.couponCode] = coupon;
            // --- Adjust disabled logic based on actual coupon properties ---
             // Example: Check status and quantity. Use || 0 for quantity if it might be missing/null
            const isDisabled = !coupon.status || (coupon.quantity ?? 0) <= 0;
            return {
              label: `${coupon.couponCode} - ${coupon.description || 'Discount'} ${isDisabled ? '(Unavailable)' : ''}`,
              value: coupon.couponCode,
              disabled: isDisabled,
            };
          });
          setCoupons(options);
          setAllCouponDetails(detailsMap);
        } catch (error) {
          console.error('Failed to fetch coupons:', error);
          message.error('Could not load available coupons.');
          setCoupons([]); // Reset on error
          setAllCouponDetails({});
        } finally {
          setIsFetchingCoupons(false);
        }
      };
      fetchCoupons();
    } else {
      resetState(); // Reset when modal closes
    }
  }, [visible]); // Only run when visibility changes

  // --- Calculate Final Price ---
  const calculatedPriceDetails = useMemo(() => {
    const subTotal = initialTotalPrice;
    let discountAmount = 0;
    let finalPrice = subTotal;
    let error = null;
    let appliedCoupon = null;

    if (selectedCouponCode && allCouponDetails[selectedCouponCode]) {
      const coupon = allCouponDetails[selectedCouponCode];
      appliedCoupon = coupon;

      // --- Adjust property names based on your Coupon model ---
      const isCouponValid = coupon.status && (coupon.quantity ?? 0) > 0; // Example
      const minOrderValue = coupon.minBill ?? 0; // Example
      const discountPercent = coupon.discountPercent ?? 0; // Example
      const maxDiscountValue = coupon.maxDiscount; // Example (can be null/undefined)

      if (!isCouponValid) {
        error = `Coupon "${coupon.couponCode}" is currently unavailable.`;
        appliedCoupon = null;
      } else if (subTotal >= minOrderValue) {
        if (discountPercent > 0) {
          discountAmount = Math.round((subTotal * discountPercent) / 100);
          if (maxDiscountValue != null && discountAmount > maxDiscountValue) {
            discountAmount = maxDiscountValue;
          }
          finalPrice = subTotal - discountAmount;
        } else {
          // Handle other discount types if necessary
          discountAmount = 0;
          finalPrice = subTotal;
        }
      } else {
        error = `Minimum order value of ${formatPrice(
          minOrderValue
        )} not met for coupon ${coupon.couponCode}.`;
        discountAmount = 0;
        finalPrice = subTotal;
        appliedCoupon = null;
      }
    }
    finalPrice = Math.max(0, finalPrice);

    return {
      subTotal,
      discountAmount,
      finalTotalAmount: finalPrice,
      couponError: error,
      // Only consider coupon applied if valid, conditions met, and discount > 0
      appliedCoupon: appliedCoupon && !error && discountAmount > 0 ? appliedCoupon : null,
    };
  }, [selectedCouponCode, allCouponDetails, initialTotalPrice]);

  // --- Update Coupon Error State ---
  useEffect(() => {
    setCouponError(calculatedPriceDetails.couponError);
  }, [calculatedPriceDetails.couponError]);

  // --- Payment Handler ---
  const handlePayment = async () => {
    if (couponError) {
      message.error(couponError, 3);
      return;
    }
    // Basic validation
    if (!showtimeCode || !userCode || seats.length === 0) {
      message.error('Missing critical booking information. Cannot proceed.', 3);
      console.error('Missing data:', { showtimeCode, userCode, seats });
      return;
    }

    setProcessing(true);
    message.loading({ content: 'Processing booking...', key: 'payment', duration: 0 });

    let newBookingId = null;
    let newPaymentId = null;

    try {
      const now = new Date();
      const createdAtISO = now.toISOString();
      const expiredAtISO = new Date(now.getTime() + 15 * 60 * 1000).toISOString(); // Example: 15 min expiry

      // --- Step 1: Create Booking ---
      const bookingPayload = {
        totalPrice: calculatedPriceDetails.finalTotalAmount,
        createdAt: createdAtISO,
        expiredAt: expiredAtISO,
        cancelledAt: null,
        status: "PENDING",
        // userId: userCode, // Include if your Booking entity needs userId directly
      };

      console.log('Attempting POST /api/bookings with:', bookingPayload);
      const bookingResponse = await api.post('/api/bookings', bookingPayload);

      if (!bookingResponse.data?.id) {
        throw new Error("Booking creation failed or ID missing in response.");
      }
      newBookingId = bookingResponse.data.id;
      console.log('Booking Created Response:', bookingResponse.data);
      message.success({ content: 'Booking created...', key: 'payment', duration: 1.5 });

      // --- Step 2: Create Payment ---
      const paymentPayload = {
        method: 'SIMULATED_BANK', // Identify as simulation
        totalAmount: calculatedPriceDetails.finalTotalAmount, // Verify backend field name
        date: createdAtISO,
        userId: userCode, // Verify backend field name
        status: 'COMPLETED', // Simulate successful payment
        bookingId: newBookingId, // Link to booking
      };

      // --- Verify '/api/payments' endpoint ---
      console.log('Attempting POST /api/payments with:', paymentPayload);
      const paymentResponse = await api.post('/api/payments', paymentPayload);

      if (!paymentResponse.data?.id && !paymentResponse.data?.paymentCode) {
        // Decide how to handle missing payment ID: warn, throw, or use placeholder
        throw new Error("Payment creation failed or ID/Code missing in response.");
      }
      newPaymentId = paymentResponse.data.id || paymentResponse.data.paymentCode;
      console.log('Payment Recorded Response:', paymentResponse.data);
      message.success({ content: 'Payment recorded...', key: 'payment', duration: 1.5 });

      // --- Step 3: Create Booking Details ---
      // ** IMPORTANT: This assumes a 'POST /api/booking-details' endpoint exists **
      // ** This endpoint IS NOT in the BookingController.java provided earlier **
      // ** You MUST have a separate controller/endpoint for this to work. **

      const seatCodes = seats.map(seat => seat.seatCode);
      const taxAmount = 0; // Example tax calculation

      const bookingDetailsPayload = {
        userCode: userCode,
        showTimeCode: showtimeCode,
        seatCode: seatCodes, // Backend needs to handle array or you loop here
        subTotal: calculatedPriceDetails.subTotal,
        discountAmount: calculatedPriceDetails.discountAmount,
        taxAmount: taxAmount,
        totalAmount: calculatedPriceDetails.finalTotalAmount,
        couponCode: selectedCouponCode, // Send applied coupon code
        paymentCode: newPaymentId, // Link to payment
        bookingCode: newBookingId, // Link to booking
        status: 'COMPLETED',
      };

      console.log('Attempting POST /api/booking-details with:', bookingDetailsPayload);
      const bookingDetailsResponse = await api.post('/api/booking-details', bookingDetailsPayload);

      console.log('Booking Details Saved Response:', bookingDetailsResponse.data);
       // Add basic check for success, e.g., status code or data presence
       if (bookingDetailsResponse.status < 200 || bookingDetailsResponse.status >= 300) {
           throw new Error(`Failed to save booking details (status: ${bookingDetailsResponse.status})`);
       }
      message.success({ content: 'Booking details saved...', key: 'payment', duration: 1.5 });

      // --- Step 4 (Optional): Final Update to Booking Status ---
       try {
           console.log(`Attempting PUT /api/bookings/${newBookingId} to set status COMPLETED`);
           await api.put(`/api/bookings/${newBookingId}`, {
               ...bookingResponse.data, // Resend original data from booking creation
               status: 'COMPLETED', // Update status
           });
           console.log('Booking status updated to COMPLETED.');
           message.success({ content: 'Booking status finalized...', key: 'payment', duration: 1.5 });
       } catch (updateError) {
           console.error("Failed to update final booking status:", updateError);
           message.warning({ content: 'Could not update final booking status.', key: 'payment', duration: 3 });
       }

      // --- Final Success ---
      message.success({
        content: `Booking ${newBookingId} confirmed successfully!`,
        key: 'payment',
        duration: 4,
      });
      onPaymentSuccess(newBookingId); // Callback with booking ID
      onClose(); // Close modal

    } catch (error) {
      console.error('Booking process failed:', error);
      const errorMsg = error.response?.data?.message ||
                       error.response?.data?.error ||
                       error.message ||
                       'An unexpected error occurred during booking.';
      message.error({ content: `Booking failed: ${errorMsg}`, key: 'payment', duration: 5 });
      // Consider adding cleanup logic here if needed (e.g., cancel booking)
    } finally {
      setProcessing(false); // Ensure loading stops
    }
  };


  if (!bookingDetails) return null;

  // --- Theme ---
  const themeConfig = { token: { colorPrimary: '#dc2626' } }; // Red

  return (
    <ConfigProvider theme={themeConfig}>
      <Modal
        title={
          <Title level={4} style={{ margin: 0, textAlign: 'center' }}>
            Confirm Booking
          </Title>
        }
        open={visible}
        onCancel={onClose}
        width={500}
        centered
        bodyStyle={{ background: '#f9fafb' }}
        footer={[
          <Button
            key="back"
            onClick={onClose}
            disabled={processing}
            className="hover:!border-gray-400 hover:!text-gray-700"
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            loading={processing}
            onClick={handlePayment} // Use the implemented handler
            disabled={!!couponError || processing} // Disable if error or processing
            className={`!text-white !font-semibold ${
              couponError || processing
                ? '!bg-gray-400 !border-gray-400 !cursor-not-allowed'
                : '!bg-red-600 hover:!bg-red-700 !border-red-600 hover:!border-red-700'
            }`}
          >
            {/* Update button text */}
            {processing
              ? 'Processing...'
              : `Confirm & Book ${formatPrice(calculatedPriceDetails.finalTotalAmount)} đ`}
          </Button>,
        ]}
      >
        <Spin
          spinning={processing || isFetchingCoupons}
          tip={processing ? 'Finalizing booking...' : 'Loading details...'} // Updated tip
        >
          <div className="p-5 flex flex-col gap-5">
            {/* Section 1: Booking Summary */}
            <div>
              <Paragraph strong className="!text-gray-800 !mb-2 text-base">
                Booking Summary
              </Paragraph>
              <div className="space-y-1.5 text-sm bg-white p-4 rounded-md shadow-sm border border-gray-200">
                {/* Summary fields */}
                 <div className='flex justify-between'>
                   <Text type='secondary'>Movie:</Text>{' '}
                   <Text strong className='text-right'>
                     {movieTitle}
                   </Text>
                 </div>
                 <div className='flex justify-between'>
                   <Text type='secondary'>Cinema:</Text>{' '}
                   <Text className='text-right'>{cinemaName}</Text>
                 </div>
                 <div className='flex justify-between'>
                   <Text type='secondary'>Date & Time:</Text>{' '}
                   <Text className='text-right'>{`${displayDate}, ${startTime}`}</Text>
                 </div>
                 <div className='flex justify-between'>
                   <Text type='secondary'>Room:</Text>{' '}
                   <Text className='text-right'>{screenCode}</Text>
                 </div>
                 <div className='flex justify-between items-start'>
                   <Text type='secondary'>Seats:</Text>
                   <div className='flex flex-wrap gap-1 justify-end max-w-[70%]'>
                     {seats.length > 0 ? (
                       // Corrected: Render seatCode from seat object
                       seats.map(seat => (
                         <Tag key={seat.seatCode} color='red'>
                           {seat.seatCode}
                         </Tag>
                       ))
                     ) : (
                       <Text type='secondary'>N/A</Text>
                     )}
                   </div>
                 </div>
              </div>
            </div>

            {/* Section 2: Coupon Application */}
            <div>
              <Paragraph strong className="!text-gray-800 !mb-2 text-base">
                Apply Coupon
              </Paragraph>
              <Select
                placeholder="Select an available coupon"
                options={coupons}
                value={selectedCouponCode}
                onChange={(value) => {
                  setSelectedCouponCode(value);
                  // Error is recalculated in useMemo, no need to reset here
                }}
                allowClear
                style={{ width: '100%' }}
                className="[&_.ant-select-selector]:!rounded-md"
                notFoundContent={
                  isFetchingCoupons ? (
                    <div style={{ textAlign: 'center', padding: '10px' }}><Spin size="small" /></div>
                  ) : (
                    <span className="text-gray-500 px-3 py-2 block">
                      No coupons available
                    </span>
                  )
                }
                disabled={
                  processing || isFetchingCoupons || coupons.length === 0
                }
              />
              {/* Coupon Error */}
              {couponError && (
                <Alert
                  message={couponError}
                  type="warning"
                  showIcon
                  className="!mt-2 !text-xs !py-1 !px-2"
                />
              )}
              {/* Applied Coupon Success Info - Show only if discount > 0 */}
              {calculatedPriceDetails.appliedCoupon && calculatedPriceDetails.discountAmount > 0 && !couponError && (
                <div className="mt-2 text-green-600 text-xs font-medium flex items-center gap-1">
                  <CheckCircleFilled />
                  <span>
                    Coupon "{selectedCouponCode}" applied! (-
                    {formatPrice(calculatedPriceDetails.discountAmount)} đ)
                  </span>
                </div>
              )}
            </div>

            {/* Section 3: Price Breakdown */}
            <div>
              <Paragraph strong className="!text-gray-800 !mb-2 text-base">
                Price Details
              </Paragraph>
              <div className="space-y-1.5 text-sm bg-white p-4 rounded-md shadow-sm border border-gray-200">
                <div className="flex justify-between">
                  <Text type="secondary">Subtotal:</Text>{' '}
                  <Text>{formatPrice(calculatedPriceDetails.subTotal)} đ</Text>
                </div>
                {/* Show discount only if > 0 */}
                {calculatedPriceDetails.discountAmount > 0 && (
                  <div className="flex justify-between">
                    <Text className="text-green-600">
                      Discount {selectedCouponCode ? `(${selectedCouponCode})` : ''}:
                    </Text>{' '}
                    <Text className="text-green-600">
                      - {formatPrice(calculatedPriceDetails.discountAmount)} đ
                    </Text>
                  </div>
                )}
                <Divider className="!my-2" />
                <div className="flex justify-between items-center">
                  <Text strong className="text-base text-gray-800">
                    Total Amount:
                  </Text>
                  <Text strong className="text-xl text-red-600">
                    {formatPrice(calculatedPriceDetails.finalTotalAmount)} đ
                  </Text>
                </div>
              </div>
            </div>

            {/* Section 4: Payment Method (Simulation UI) */}
            <div>
              <Paragraph strong className="!text-gray-800 !mb-2 text-base">
                Payment Method (Simulation)
              </Paragraph>
              <div className="border-2 border-blue-500 rounded-lg p-3 flex items-center justify-between bg-white shadow-sm relative">
                <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-0.5">
                  <CheckCircleFilled className="text-white text-base" />
                </div>
                <div className="flex items-center gap-3">
                  <AntdImage
                    src={vnpayLogoUrl}
                    alt="Simulated Payment Logo"
                    width={50}
                    preview={false}
                  />
                  {/* Update text to reflect simulation */}
                  <Text strong className="text-base text-gray-800">
                    Simulated Bank/Card Payment
                  </Text>
                </div>
              </div>
            </div>

            {/* Informational Text */}
            <Paragraph
              type="secondary"
              className="!text-gray-500 !text-center !text-xs !mt-2"
            >
              {/* Update informational text */}
              Click "Confirm & Book" to finalize your booking. No real payment required.
            </Paragraph>
          </div>
        </Spin>
      </Modal>
    </ConfigProvider>
  );
};

// --- PropTypes ---
PaymentModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  bookingDetails: PropTypes.shape({
    movieTitle: PropTypes.string,
    cinemaName: PropTypes.string,
    screenCode: PropTypes.string,
    date: PropTypes.string,
    startTime: PropTypes.string,
    seats: PropTypes.arrayOf(
      PropTypes.shape({
        seatCode: PropTypes.string.isRequired, // seatCode is required inside the object
        price: PropTypes.number,
        type: PropTypes.string,
      })
    ).isRequired, // Ensure seats array itself is required and matches structure
    totalPrice: PropTypes.number, // Subtotal before coupon
    showtimeCode: PropTypes.string, // Needed for booking details payload
    // userCode is now handled within the component, but could be passed via props
  }),
  onPaymentSuccess: PropTypes.func.isRequired,
};

export default PaymentModal;