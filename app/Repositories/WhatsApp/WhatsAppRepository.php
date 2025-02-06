<?php

namespace App\Repositories\WhatsApp;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Http;

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
    // $curl = curl_init();

    // curl_setopt_array($curl, array(
    //   CURLOPT_URL => 'https://api.fonnte.com/send',
    //   CURLOPT_RETURNTRANSFER => true,
    //   CURLOPT_ENCODING => '',
    //   CURLOPT_MAXREDIRS => 10,
    //   CURLOPT_TIMEOUT => 0,
    //   CURLOPT_FOLLOWLOCATION => true,
    //   CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    //   CURLOPT_CUSTOMREQUEST => 'POST',
    //   CURLOPT_POSTFIELDS => array(
    //     'target' => $data['target'],
    //     'message' => $data['message'],
    //   ),
    //   CURLOPT_HTTPHEADER => array(
    //     'Authorization:' . $data['appkey'] //change TOKEN to your actual token
    //   ),
    // ));
    
    // $response = curl_exec($curl);

    // curl_close($curl);
    $api_url = 'https://api.fonnte.com/send';
    $api_key = $data['appkey'];

    // $client = new Client();

    // $response = $client->request('POST', $api_url, [
    //   'headers' => [
    //     'Authorization' => $api_key,
    //   ],
    //   'form_params' => [
    //     'target'  => $data['target'],
    //     'message' => $data['message'],
    //   ],
    // ]);


    $response = Http::withHeaders([
      'Authorization' => $data['appkey'],
    ])->asForm()->post($api_url, [
      'target'  => $data['target'],
      'message' => $data['message'],
    ]);


    // dd($response);
    return  $response->json();
  }

  public function sendMultiMessageViaFonte($data)
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
      CURLOPT_POSTFIELDS => array('data' => $data['multi']),
      CURLOPT_HTTPHEADER => array(
        'Authorization: ' . $data['appkey'] //change TOKEN to your actual token
      ),
    ));

    $response = curl_exec($curl);

    curl_close($curl);
    return  $response;
  }
}
