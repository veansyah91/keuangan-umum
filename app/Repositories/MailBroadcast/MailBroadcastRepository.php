<?php

namespace App\Repositories\MailBroadcast;

use Illuminate\Support\Facades\Blade;

class MailBroadcastRepository implements MailBroadcastRepositoryInterface
{
  protected function api($data, $token, $end_point){
    $api_token=$token; //silahkan copy dari api token mailketing
    $from_name='Keuangan Umum'; //nama pengirim
    $from_email='admin@keuanganumum.com'; //email pengirim
    $subject=$data['content']['subject']; //judul email
    $content=Blade::render(
      file_get_contents(resource_path('views/email.blade.php')),
      $data['content']
    );; //isi email format text / html
    $recipient=$data['user']->email; //penerima email


    $params = [
      'from_name' => $from_name,
      'from_email' => $from_email,
      'recipient' => $recipient,
      'subject' => $subject,
      'content' => $content,
      'api_token' => $api_token
    ];
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL,"$end_point");
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $output = curl_exec ($ch); 
    print_r($output);
    curl_close ($ch);
    return $output;
  }

  public function mailketing($data)
  {
    $token = "f7b0f0d4451fd66276f8a4ce83b4b59c";
    $end_point = "https://api.mailketing.co.id/api/v1/send";
    $login = "veansyah91@gmail.com";

    return $this->api($data, $token, $end_point);
  }
}