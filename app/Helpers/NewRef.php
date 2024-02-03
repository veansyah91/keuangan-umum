<?php
namespace App\Helpers;

class NewRef {
    public static function create($initial, $no_ref){
        $split_end_invoice = explode('-', $no_ref);
        $newNumber = (int)$split_end_invoice[1] + 1;
        return $initial . $newNumber;
    }
}