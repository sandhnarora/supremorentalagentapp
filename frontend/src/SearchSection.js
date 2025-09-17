import { Button, FormControl, FormGroup, Modal } from "react-bootstrap";
import React, { useState, useEffect } from 'react';
import { event } from "jquery";
import { useHistory } from 'react-router-dom';

function SearchSection({ placeholder, data, onFilterChange }) {
	// if (!backendData) {
	//   return <div>Loading...</div>;
	// }
	const [showAgentDrivenExp, setshowAgentDrivenExp] = useState(false);

	  const handleOpenAgentModal = () => {
			setshowAgentDrivenExp(true);
		};

		const handleCloseAgentModal = () => {
			setshowAgentDrivenExp(false);
		};

	const [searchValue, setSearchValue] = useState('');
	const onChange = (event) => {
		setSearchValue(event.target.value);
		//setSearchValue(searchText);
	}

	const onSearch = (searchtext) => {
		setSearchValue(searchtext);
		onFilterChange(searchtext);
		console.log( "this is the search text selected", searchtext);
		// searchTextVal = searchtext;
	}	

	 useEffect(() => {
		setshowAgentDrivenExp(false);
		console.log("useeffect called ");
	  }, []);
	// console.log("backendData  ", data);
	return (
		<>
			<section className="ftco-section ftco-no-pt bg-light mx-md-4">
				<div className="container-fluid">
					<div className="row no-gutters">
						<div className="col-md-12	featured-top">
							<div className="row no-gutters">
								<div className="col-md-12 d-flex align-items-center bg-primary">

									<form action="#" className="request-form bg-primary fadeInUp text-left d-flex w-100">

										<div className="d-flex align-bottom w-100">
											<div className="form-group mr-2 d-flex col-md-12 searchTxtOuter">
												{/* <FormGroup className="col-md-10">
													<FormControl type="text" placeholder={placeholder} className="searchTxt" value={searchValue} onChange={onChange} />
												</FormGroup>{' '} */}
												{/* <Button className="col-md-2 btn btn-secondary" onClick={() => onSearch(searchValue)}>Submit</Button> */}

												<Button className="col-md-2 btn btn-secondary" onClick={() => handleOpenAgentModal()  }><span className="agenai_icon"><img src="/resources/images/genai_icon.svg"/></span> Agent Driven Experience</Button>
												
											</div>
										</div>
									</form>
								</div>
								<div className="d-flex align-bottom w-100">
												<div className="form-group mr-2 d-flex col-md-12">
													<div className="dropdownSearch"> 
													{data.filter(item => {
													const searchTerm = searchValue.toLowerCase();
													const brandNameBrand = item.brand.toLowerCase();
													const brandNameVal = item.name.toLowerCase();
													const brandFuelType = item.fueltype.toLowerCase();
													const brandVehType = item.vehicletype.toLowerCase();

													return (
														searchTerm &&
														(brandNameBrand.includes(searchTerm) ||
														brandNameVal.includes(searchTerm) ||
														brandFuelType.includes(searchTerm) ||
														brandVehType.includes(searchTerm)) &&
														brandNameBrand !== searchTerm
													);
													}).map((item) => (
													<div key={item.id} onClick={() => onSearch(item.brand + " " + item.name + " - " + item.fueltype)}>
														{item.brand + " " + item.name + " - " + item.fueltype}
													</div>
													))}
													</div>
												</div>
											</div>

								<div className="dflex w-100 col-md-12">
									<div className="">
									</div>
								</div>

							</div>
						</div>
					</div>
				</div>
			</section>

			<Modal
        show={showAgentDrivenExp}
        onHide={handleCloseAgentModal}
        className="agentExp"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Agent Driven Experience</Modal.Title>
        </Modal.Header>
        <Modal.Body className="agentBody">
          <div className="dflex w-100 col-md-12" style={{padding:0}}>
			<iframe src="http://localhost:8501/" width="100%" height="500px" style={{ border: 'none' }}></iframe>
		  </div>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAgentModal}>
            Close
          </Button>
        </Modal.Footer> */}
      </Modal>											
			
		</>
	);
}

export default SearchSection;