import Container from '@/Components/Container';
import Header from '@/Components/Header';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const Dashboard = ({ auth, organization }) => {
    return (
        <>
            <Head title='Dasbor' />

            <Container>
                <div className='max-w-7xl mx-auto sm:px-6 lg:px-8'>
                    <div className='bg-white overflow-hidden shadow-sm sm:rounded-lg'>
                        <div className='p-6 text-gray-900'>PENERIMAAN</div>
                    </div>
                </div>
            </Container>
        </>
    );
}

Dashboard.layout = page => <AuthenticatedLayout
    header={<Header>Dasbor</Header>}
    children={page}
    user={page.props.auth.user}
    organization={page.props.organization}
    role={page.props.role}
/>

export default Dashboard;
