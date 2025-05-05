import AddWebsiteComponent from '../../widgets/AddWebsiteComponent';
import ContentBlock from '../../widgets/WebsiteBlock';
import './HomePage.css'

const HomePage = () => {
    return <div className='list-layout'>
        {[...Array(3)].map((_,i) => {
            return <ContentBlock key={i} elementId={i}/>
        })}
        <AddWebsiteComponent/>
    </div>;
};

export default HomePage;