<?php

namespace App\Models;

use App\Models\Contact;
use App\Models\Journal;
use App\Models\StudentPaymentCategory;
use Illuminate\Database\Eloquent\Model;
use App\Models\StudentMonthlyReceivableLedger;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class StudentMonthlyPayment extends Model
{
	use HasFactory;

	protected $fillable = [
		'organization_id',
		'contact_id',
		'no_ref',
		'value',
		'type',
		'date',
		'month',
		'study_year',
		'created_by_id',
		'journal_id'
	];

	public function scopeFilter($query, $filters)
	{
		$query->when($filters['search'] ?? false, function ($query, $search) {
			return $query->where('no_ref', 'like', '%'.$search.'%')
										->orWhereHas('contact', function ($query) use ($search){
											$query->where('name', 'like', '%'. $search .'%')
														->orWhereHas('student', function ($query) use ($search){
															$query->where('no_ref', 'like', '%'. $search .'%');
														});
			});
		});
	}

	public function contact(): BelongsTo
	{
		return $this->belongsTo(Contact::class);
	}

	public function details(): BelongsToMany
	{
		return $this->belongsToMany(StudentPaymentCategory::class, 's_monthly_payment_details', 'payment_id', 'student_payment_category_id')->withPivot('value');
	}

	public function receivableLedger(): HasOne
	{
		return $this->hasOne(StudentMonthlyReceivableLedger::class, 'payment_id');
	}

	public function journal(): BelongsTo
    {
        return $this->belongsTo(Journal::class);
    }
}
