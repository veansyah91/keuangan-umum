<?php

namespace App\Helpers;

class PhoneNumber 
{
  public static function setFormat($number): string
  {
    $awal = substr($number, 0, 1); // Ambil 1 karakter pertama
    if ($awal === '0') {
      return '62' . substr_replace($number, "", 0, 1);
    }
    return $number;
  }
}