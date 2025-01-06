<?php

namespace App\Repositories\WhatsApp;

class WhatsAppRepository implements WhatsAppRepositoryInterface
{
  public function sendMessage($data)
  {
    $curl = curl_init();

    curl_setopt_array($curl, array(
      CURLOPT_URL => 'https://app.wapanels.com/api/create-message',
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => '',
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 0,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => 'POST',
      CURLOPT_POSTFIELDS => $data,
    ));

    $response = curl_exec($curl);

    curl_close($curl);

    return $response;
  }

  public function sendMessageViaFonte($data)
  {
    $curl = curl_init();

    curl_setopt_array($curl, array(
      CURLOPT_URL => 'https://api.fonnte.com/send',
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => '',
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 0,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => 'POST',
      CURLOPT_POSTFIELDS => array(
        'target' => '08123456789',
        'message' => 'test message', 
        'countryCode' => '62', //optional
      ),
      CURLOPT_HTTPHEADER => array(
        'Authorization: TOKEN' //change TOKEN to your actual token
      ),
    ));

    $response = curl_exec($curl);

    curl_close($curl);
    return  $response;
  }
}
