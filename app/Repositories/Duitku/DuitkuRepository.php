<?php

namespace App\Repositories\Duitku;

class DuitkuRepository implements DuitkuRepositoryInterface
{
  public function getPaymentMethod(){
    $urlDev = "https://sandbox.duitku.com/webapi/api/merchant/paymentmethod/getpaymentmethod";
    $urlProd = "https://passport.duitku.com/webapi/api/merchant/paymentmethod/getpaymentmethod";
    $url = env('APP_ENV') == 'production' ? $urlProd : $urlDev;

    // Set kode merchant anda 
    $merchantCode = "DXXXX"; 
    // Set merchant key anda 
    $apiKey = "DXXXXCX80TZJ85Q70QCI";
    // catatan: environtment untuk sandbox dan passport berbeda 

    $datetime = date('Y-m-d H:i:s');  
    $paymentAmount = 10000;
    $signature = hash('sha256',$merchantCode . $paymentAmount . $datetime . $apiKey);

    $params = array(
        'merchantcode' => $merchantCode,
        'amount' => $paymentAmount,
        'datetime' => $datetime,
        'signature' => $signature
    );

    $params_string = json_encode($params);

    $url = 'https://sandbox.duitku.com/webapi/api/merchant/paymentmethod/getpaymentmethod'; 

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url); 
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");                                                                     
    curl_setopt($ch, CURLOPT_POSTFIELDS, $params_string);                                                                  
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);                                                                      
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(                                                                          
        'Content-Type: application/json',                                                                                
        'Content-Length: ' . strlen($params_string))                                                                       
    );   
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);

    //execute post
    $request = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if($httpCode == 200)
    {
        $results = json_decode($request, true);
        print_r($results, false);
    }
    else{
        $request = json_decode($request);
        $error_message = "Server Error " . $httpCode ." ". $request->Message;
        echo $error_message;
    }
  }

  public function createInvoice($data){
    $merchantCode = $data['merchantCode']; // dari duitku
    $merchantKey = $data['merchantKey']; // dari duitku

    $timestamp = round(microtime(true) * 1000); //in milisecond
    $paymentAmount = $data['paymentAmount'];
    $merchantOrderId = $data['merchantOrderId']; // dari merchant, unique
    $productDetails = $data['productDetails'];
    $email = $data['user']->email; // email pelanggan merchant
    $phoneNumber = $data['user']->phone; // nomor tlp pelanggan merchant (opsional)
    $additionalParam = ''; // opsional
    $merchantUserInfo = ''; // opsional
    $customerVaName = $data['user']->name; // menampilkan nama pelanggan pada tampilan konfirmasi bank
    $callbackUrl = 'http://example.com/api-pop/backend/callback.php'; // url untuk callback
    $returnUrl = $data['returnUrl'];//'http://example.com/return'; // url untuk redirect
    $expiryPeriod = 60; // untuk menentukan waktu kedaluarsa dalam menit
    $signature = hash('sha256', $merchantCode.$timestamp.$merchantKey);
    //$paymentMethod = 'VC'; //digunakan untuk direksional pembayaran

    // Detail pelanggan
    $firstName = $data['user']->name;
    $lastName = "";

    // Detail Alamat
    $alamat = $data['user']->address;
    $city = "";
    $postalCode = "";
    $countryCode = "ID";

    $address = array(
        'firstName' => $firstName,
        'lastName' => $lastName,
        'address' => $alamat,
        'city' => $city,
        'postalCode' => $postalCode,
        'phone' => $phoneNumber,
        'countryCode' => $countryCode
    );

    $customerDetail = array(
       'firstName' => $firstName, 
        'lastName' => $lastName, 
        'email' => $email, 
        'phoneNumber' => $phoneNumber,
        'billingAddress' => $address,
        'shippingAddress' => $address
    );


    $item1 = array(
        'name' => 'Test Item 1',
        'price' => 10000,
        'quantity' => 1);

    $item2 = array(
        'name' => 'Test Item 2',
        'price' => 30000,
        'quantity' => 3);

    $itemDetails = $data['product_details'];

    /*Khusus untuk metode pembayaran Kartu Kredit
    $creditCardDetail = array (
        'acquirer' => '014',
        'binWhitelist' => array (
            '014',
            '400000'
        )
    );*/

    $params = array(
        'paymentAmount' => $paymentAmount,
        'merchantOrderId' => $merchantOrderId,
        'productDetails' => $productDetails,
        'additionalParam' => $additionalParam,
        'merchantUserInfo' => $merchantUserInfo,
        'customerVaName' => $customerVaName,
        'email' => $email,
        'phoneNumber' => $phoneNumber,
        'itemDetails' => $itemDetails,
        'customerDetail' => $customerDetail,
        //'creditCardDetail' => $creditCardDetail,
        'callbackUrl' => $callbackUrl,
        'returnUrl' => $returnUrl,
        'expiryPeriod' => $expiryPeriod
        //'paymentMethod' => $paymentMethod
    );

    dd($params);

    $params_string = json_encode($params);
    //echo $params_string;
    $url = 'https://api-sandbox.duitku.com/api/merchant/createinvoice'; // Sandbox
    // $url = 'https://api-prod.duitku.com/api/merchant/createinvoice'; // Production

    //log transaksi untuk debug 
    // file_put_contents('log_createInvoice.txt', "* log *\r\n", FILE_APPEND | LOCK_EX);
    // file_put_contents('log_createInvoice.txt', $params_string . "\r\n\r\n", FILE_APPEND | LOCK_EX);
    // file_put_contents('log_createInvoice.txt', 'x-duitku-signature:' . $signature . "\r\n\r\n", FILE_APPEND | LOCK_EX);
    // file_put_contents('log_createInvoice.txt', 'x-duitku-timestamp:' . $timestamp . "\r\n\r\n", FILE_APPEND | LOCK_EX);
    // file_put_contents('log_createInvoice.txt', 'x-duitku-merchantcode:' . $merchantCode . "\r\n\r\n", FILE_APPEND | LOCK_EX);
    $ch = curl_init();


    curl_setopt($ch, CURLOPT_URL, $url); 
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");                                                                     
    curl_setopt($ch, CURLOPT_POSTFIELDS, $params_string);                                                                  
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);                                                                      
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(                                                                          
        'Content-Type: application/json',                                                                                
        'Content-Length: ' . strlen($params_string),
        'x-duitku-signature:' . $signature ,
        'x-duitku-timestamp:' . $timestamp ,
        'x-duitku-merchantcode:' . $merchantCode    
        )                                                                       
    );   
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);

    //execute post
    $request = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if($httpCode == 200)
    {
        $result = json_decode($request, true);
        //header('location: '. $result['paymentUrl']);
        print_r($result, false);
        // echo "paymentUrl :". $result['paymentUrl'] . "<br />";
        // echo "reference :". $result['reference'] . "<br />";
        // echo "statusCode :". $result['statusCode'] . "<br />";
        // echo "statusMessage :". $result['statusMessage'] . "<br />";
    }
    else
    {
        // echo $httpCode . " " . $request ;
        echo $request ;
    }

  }

}
