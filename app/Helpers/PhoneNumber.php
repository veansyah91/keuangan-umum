<?php

namespace App\Helpers;

class PhoneNumber 
{
  public static function setFormat($number)
  {
    $awal = substr($number, 0, 3); // Ambil 1 karakter pertama
    return $awal;
  }
}