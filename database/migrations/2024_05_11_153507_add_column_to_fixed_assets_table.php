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
        Schema::table('fixed_assets', function (Blueprint $table) {
            $table->boolean('is_disposed')->default(false);
            $table->date('disposal_date')->nullable();
            $table->string('disposal_ref')->nullable();
            $table->string('disposal_description')->nullable();

            $table->unsignedBigInteger('disposal_journal_id')->nullable();          
            $table->foreign('disposal_journal_id')->references('id')->on('journals'); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('fixed_assets', function (Blueprint $table) {
            $table->dropColumn('is_disposed');
            $table->dropColumn('disposal_date');
            $table->dropColumn('disposal_ref');
            $table->dropColumn('disposal_description');

            $table->dropForeign('disposal_journal_id');   
        });
    }
};
