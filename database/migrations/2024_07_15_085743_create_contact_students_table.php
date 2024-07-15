<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('contact_students', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('contact_id');
            $table->foreign('contact_id')->references('id')->on('users');
            $table->string('father_name')->nullable();
            $table->string('mother_name')->nullable();
            $table->date('birthday')->nullable();
            $table->year('entry_year');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_students');
    }
};
