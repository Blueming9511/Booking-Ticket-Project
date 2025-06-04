import hmac
import hashlib
from collections import OrderedDict

VNP_SECRET_KEY = "J1T2XGP4UWRI660OB86KSBMXAD6VOGAE"

fields = {
    "vnp_BankCode": "NCB",
    "vnp_PayDate": "20250604154759",
    "vnp_TransactionNo": "14999210",
    "vnp_TmnCode": "KHMOTM7L",
    "vnp_OrderInfo": "Thanh toan don hang: 684007fcce66812939bf2949",
    "vnp_TxnRef": "03007665",
    "vnp_Amount": "7500000",
    "vnp_CardType": "ATM",
    "vnp_TransactionStatus": "00",
    "vnp_BankTranNo": "VNP14999210",
    "vnp_ResponseCode": "00"
}

# Sắp xếp key giống Java
sorted_fields = OrderedDict(sorted(fields.items()))

# Không dùng quote_plus! Để nguyên
hash_data = '&'.join(f"{key}={value}" for key, value in sorted_fields.items())

secure_hash = hmac.new(
    VNP_SECRET_KEY.encode('utf-8'),
    hash_data.encode('utf-8'),
    hashlib.sha512
).hexdigest()

print("Data string (same as Java):")
print(hash_data)
print("\nSecureHash (like Java):")
print(secure_hash)
